import { GoogleGenerativeAI } from '@google/generative-ai';
import { bioData } from './data/bio';
import { experienceData } from './data/experience';
import { projectsData, repoMapping } from './data/projects';

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
  } catch (e) {
    return { error: "GitHub API error." };
  }
}

export default async function handler(req: Request) {
  const allowedOrigins = [
    'https://sabari-vijayan.github.io',
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
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) return new Response(JSON.stringify({ error: 'API Key missing' }), { status: 500, headers });

    const q = query.toLowerCase();
    let relevantContext = bioData;
    if (q.match(/work|job|experience|study|college|education|school|tinkerhub/)) relevantContext += experienceData;
    if (q.match(/project|build|code|repo|github|link|site|app/)) relevantContext += projectsData;

    // --- AGENTIC TOOL DETECTION (PRE-FETCH PATTERN) ---
    // Since Edge runtime is fast, we'll pre-check if a project is mentioned and fetch its data
    let githubDetails = "";
    for (const project in repoMapping) {
      if (q.includes(project)) {
        const info = await getGithubInfo(project);
        if (!info.error) {
          githubDetails = `\nREAL-TIME GITHUB DATA FOR ${project.toUpperCase()}:\n${JSON.stringify(info, null, 2)}`;
          break;
        }
      }
    }

    const genAI = new GoogleGenerativeAI(apiKey);
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

    const result = await model.generateContent(`${systemPrompt}\n\nUser Question: ${query}`);
    const text = result.response.text();

    return new Response(JSON.stringify({ text }), { status: 200, headers });
  } catch (error) {
    console.error("AI Agent Error:", error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers });
  }
}
