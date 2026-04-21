import { GoogleGenerativeAI } from '@google/generative-ai';
import { bioData } from '../src/data/bio';
import { experienceData } from '../src/data/experience';
import { projectsData, repoMapping } from '../src/data/projects';
import { blogsData } from '../src/data/blogs';

export const config = {
  runtime: 'edge',
};

async function getGithubInfo(projectName: string) {
  const repoSlug = repoMapping[projectName.toLowerCase()];
  if (!repoSlug) return { error: "Project not found or repo not mapped." };

  const url = `https://api.github.com/repos/${repoSlug}`;
  try {
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Sabari-Portfolio-Agent',
        // Optional: 'Authorization': `token ${process.env.GITHUB_TOKEN}`
      }
    });
    
    if (!res.ok) return { error: "Could not fetch repo details." };
    const data = await res.json();
    
    return {
      name: data.name,
      stars: data.stargazers_count,
      forks: data.forks_count,
      last_updated: data.updated_at,
      description: data.description,
      language: data.language,
      url: data.html_url
    };
  } catch {
    return { error: "GitHub API error." };
  }
}

export default async function handler(req: Request) {
  const allowedOrigins = [
    'https://sabari-vijayan.github.io',
    'https://Sabari-Vijayan.github.io',
    'https://portfolio-liard-alpha-anenqdv7wr.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ];
  
  const origin = req.headers.get('origin') || '';
  const isAllowed = allowedOrigins.includes(origin);

  const headers = {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers });
  }

  try {
    const { query } = await req.json();
    
    // Check for multiple possible key names found in your environment
    const apiKey = process.env.GEMINI_API_KEY || 
                   process.env.GOOGLE_API_KEY || 
                   process.env.VITE_GEMINI_API_KEY ||
                   process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ 
        error: 'API Key missing', 
        details: 'GEMINI_API_KEY not found in environment. Please check your Vercel project settings.' 
      }), { status: 500, headers });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const routerModel = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash-lite",
      generationConfig: { responseMimeType: "application/json" }
    });

    const routerPrompt = `
      Analyze the following user query and decide which data sources are needed.
      Available Contexts:
      - "bio": General identity, philosophy, and tech stack.
      - "experience": Education, volunteering, and career history.
      - "projects": Automated index of GitHub repositories and project descriptions.
      - "blogs": Articles, tutorials, and technical writing published on Medium.

      Available Repositories for real-time fetch:
      ${Object.keys(repoMapping).join(", ")}

      Respond with a JSON object:
      {
        "needs": ["bio", "experience", "projects", "blogs"], // Array of strings
        "githubFetch": "repo_name_or_null" // String or null
      }

      Query: "${query}"
    `;

    const routerResult = await routerModel.generateContent(routerPrompt);
    const routerDecision = JSON.parse(routerResult.response.text());

    let relevantContext = "";
    if (routerDecision.needs && Array.isArray(routerDecision.needs)) {
      if (routerDecision.needs.includes("bio")) relevantContext += bioData;
      if (routerDecision.needs.includes("experience")) relevantContext += experienceData;
      if (routerDecision.needs.includes("projects")) relevantContext += projectsData;
      if (routerDecision.needs.includes("blogs")) relevantContext += blogsData;
    }
    
    // Fallback if no context was selected
    if (!relevantContext) relevantContext = bioData;

    let githubDetails = "";
    if (routerDecision.githubFetch && repoMapping[routerDecision.githubFetch.toLowerCase()]) {
      const info = await getGithubInfo(routerDecision.githubFetch);
      if (!info.error) {
        githubDetails = `\nREAL-TIME GITHUB DATA FOR ${routerDecision.githubFetch.toUpperCase()}:\n${JSON.stringify(info, null, 2)}`;
      }
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    
    const systemPrompt = `
      You are the professional digital representative for Sabari Vijayan.
      
      STRICT SCOPE BARRIER:
      - ONLY discuss Sabari's skills, experience, projects, and background. Refuse all other topics.
      
      KNOWLEDGE CONTEXT:
      ${relevantContext}
      ${githubDetails}

      INSTRUCTIONS:
      1. Use the knowledge context (including real-time GitHub data if present) to answer accurately.
      2. If real-time data is available, cite the stars/updates to show you are "live".
      3. Point users to [/experience] or [/portfolio] for more details.
      4. Keep answers high-signal and professional.
    `;

    const source = githubDetails ? "GITHUB" : "AI";
    const result = await model.generateContentStream(`${systemPrompt}\n\nUser Question: ${query}`);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Send the source first
        controller.enqueue(encoder.encode(JSON.stringify({ source }) + "\n"));
        
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              controller.enqueue(encoder.encode(JSON.stringify({ text: chunkText }) + "\n"));
            }
          }
        } catch (e) {
          console.error("Streaming error:", e);
        }
        controller.close();
      },
    });

    return new Response(stream, { 
      status: 200, 
      headers: { 
        ...headers, 
        'Content-Type': 'application/x-ndjson',
        'Transfer-Encoding': 'chunked'
      } 
    });
  } catch (error) {
    console.error("AI Agent Error Detail:", error instanceof Error ? error.message : error);
    if (error instanceof Error && error.stack) console.error(error.stack);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) }), { status: 500, headers });
  }
}
