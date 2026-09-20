import { GoogleGenerativeAI } from '@google/generative-ai';
import { OpenRouter } from '@openrouter/sdk';
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

type RouterDecision = {
  needs: string[];
  githubFetch: string[];
};

type JevSignals = {
  is_off_topic_noul?: number;
  is_greeting_noul?: number;
  is_urgent_noul?: number;
  is_followup_noul?: number;
  frustration_score?: number;
  frustration_probs?: Record<string, number>;
  complexity_score?: number;
  repo_nouls?: Record<string, number>;
};

function buildJevQuestions() {
  const repoDescriptions: Record<string, string> = {
    tinkerfetch: 'terminal-based TinkerHub themed system info / fastfetch skin for tracking events',
    portfolio: 'personal portfolio site / React showcase / this website itself',
    rit_tracker: 'RIT Tracker / campus navigation / 3D AR building finder for RIT Kottayam',
    'code-a-pooakalam-25': 'code-a-pookalam 2025 / Onam pookalam coding competition site for TinkerHub RIT',
    'umang-harmony-welfare-society-theme': 'Umang Harmony Welfare Society / Ghost CMS theme / NGO website',
    'neurobots-hackathon-2026': 'AI cheating detection / online exam proctoring / Isolation Forest hackathon',
    'git-together': 'Git-Together / GitHub follower game / social follower competition',
    'dynamic-pricing-ui': 'Dynamic Pricing UI / Angular Signals / nested JSON pricing interface',
    cartinder: 'CarTinder / car rental with Tinder-style swipe / car swiping app',
    voiceform: 'VoiceForm / multilingual voice interview / speech to structured data with LLMs',
  };

  const questions: Record<string, any> = {
    needs_bio: {
      type: "noul",
      instructions: "Does the query ask about Sabari's identity, bio, role, tech stack, philosophy, location, background, or who he is? Be fuzzy: includes paraphrases like 'tell me about yourself', 'what do you do', 'stack', 'skills'.",
      criteria: { true: "Asks about identity / bio / role / skills / tech stack / philosophy", false: "No bio/identity intent" }
    },
    needs_experience: {
      type: "noul",
      instructions: "Does the query ask about education, B.Tech, RIT Kottayam, volunteering, TinkerHub, campus lead, career history, timeline or experience?",
      criteria: { true: "Education / experience / volunteering / TinkerHub / career history", false: "No experience/education intent" }
    },
    needs_projects: {
      type: "noul",
      instructions: "Does the query ask about projects, repositories, code, GitHub, builds, portfolio work, or any specific build/project detail? Fuzzy: includes 'what did you build', 'show me your work', 'repos'.",
      criteria: { true: "Project / repo / build / GitHub intent", false: "No project intent" }
    },
    needs_blogs: {
      type: "noul",
      instructions: "Does the query ask about blogs, articles, Medium posts, tutorials, or writing?",
      criteria: { true: "Blog / article / Medium / writing intent", false: "No blog intent" }
    },
    is_off_topic: {
      type: "noul",
      instructions: "Is this query about completely unrelated topics (weather, generic advice, math, news, cooking, etc.) with NO connection to Sabari's portfolio, skills, or projects? Greeting + asking about Sabari is NOT off-topic.",
      criteria: { true: "Clearly off-topic / generic unrelated question", false: "Related to Sabari, portfolio, or ambiguous / could be portfolio-related" }
    },
    is_greeting: {
      type: "noul",
      instructions: "Is this just a simple greeting, thanks, hello, hi, hey, good morning without an information need? A greeting that ALSO asks a question is NOT just greeting.",
      criteria: { true: "Only greeting/thanks/small talk, no real question", false: "Contains a question or information request beyond greeting" }
    },
    is_followup: {
      type: "noul",
      instructions: "Is this a vague follow-up like 'tell me more', 'elaborate', 'what about that', 'and?' that refers to previous context without a new topic?",
      criteria: { true: "Vague follow-up / continuation", false: "Standalone new question" }
    },
    is_urgent: {
      type: "noul",
      instructions: "Does this message convey urgency, impatience, or time sensitivity? Look for words like ASAP, urgent, quickly, need now, failing, blocked, deadline.",
      criteria: { true: "Explicitly urgent or time-sensitive, user is blocked/waiting", false: "No urgency expressed, casual inquiry" }
    },
    frustration: {
      type: "score",
      instructions: "How frustrated or upset is the user tone?",
      criteria: ["Calm and neutral / polite", "Mildly frustrated / impatient / terse", "Very frustrated / angry / demanding"]
    },
    complexity: {
      type: "score",
      instructions: "How complex is the information need?",
      criteria: ["Simple factual lookup (one fact)", "Multi-part comparison or list (several facts)", "Deep reasoning, open-ended, or needs synthesis across sources"]
    },
  };

  for (const key of Object.keys(repoMapping)) {
    const desc = repoDescriptions[key] || key;
    const qKey = `repo_${key.replace(/[^a-z0-9]/gi, "_").toLowerCase()}`;
    questions[qKey] = {
      type: "noul",
      instructions: `Does this query explicitly mention or semantically refer to the project/repo "${key}" (${desc})? Be FUZZY: count typos, partial names, synonyms, descriptions (e.g., "terminal fetch tool" -> tinkerfetch, "car swipe app" -> cartinder, "exam cheating detector" -> neurobots-hackathon-2026). Do NOT trigger for generic words like "portfolio" unless it means THIS repo vs general portfolio.`,
      criteria: { true: `Mentions or clearly refers to ${key} project`, false: `No reference to ${key}` }
    };
  }

  return questions;
}

function extractNoul(answer: any): number | undefined {
  if (answer && answer.type === "noul" && typeof answer.noul === "number") return answer.noul;
  return undefined;
}

async function getGeminiRouterDecision(genAI: GoogleGenerativeAI, query: string): Promise<RouterDecision> {
  const routerModel = genAI.getGenerativeModel({
    model: "gemini-3.5-flash-lite",
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
        "needs": ["bio", "experience", "projects", "blogs"],
        "githubFetch": ["repo_name1", "repo_name2"]
      }
      Query: "${query}"
    `;
  const routerResult = await routerModel.generateContent(routerPrompt);
  return JSON.parse(routerResult.response.text());
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

  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers });

  try {
    const { query } = await req.json();
    if (!query || typeof query !== "string" || !query.trim()) {
      return new Response(JSON.stringify({ error: "Missing query" }), { status: 400, headers });
    }
    const trimmedQuery = query.trim().slice(0, 2000);

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

    const openRouterKey = process.env.OPENROUTER_API_KEY ||
                          process.env.VITE_OPENROUTER_API_KEY ||
                          process.env.NEXT_PUBLIC_OPENROUTER_API_KEY ||
                          (process.env as any).OPEN_ROUTER_API_KEY;

    let routerDecision: RouterDecision = { needs: [], githubFetch: [] };
    let jevSignals: JevSignals = {};
    let routerSource: "jev" | "gemini-fallback" = "jev";
    const NEEDS_THRESHOLD = 0.55;
    const REPO_THRESHOLD = 0.60;
    const OFF_TOPIC_THRESHOLD = 0.80;
    let jevUsed = false;

    if (openRouterKey) {
      try {
        const openrouter = new OpenRouter({ apiKey: openRouterKey });
        const jevQuestions = buildJevQuestions();
        const decision = await (openrouter as any).alpha.decisions.create({
          decisionsRequest: { model: "~typesafe/jev-latest", state: trimmedQuery, questions: jevQuestions }
        });
        const answers: Record<string, any> = (decision as any)?.answers || (decision as any)?.data?.answers || {};

        const needs: string[] = [];
        const n_bio = extractNoul(answers.needs_bio);
        const n_exp = extractNoul(answers.needs_experience);
        const n_proj = extractNoul(answers.needs_projects);
        const n_blogs = extractNoul(answers.needs_blogs);
        if (n_bio !== undefined && n_bio > NEEDS_THRESHOLD) needs.push("bio");
        if (n_exp !== undefined && n_exp > NEEDS_THRESHOLD) needs.push("experience");
        if (n_proj !== undefined && n_proj > NEEDS_THRESHOLD) needs.push("projects");
        if (n_blogs !== undefined && n_blogs > NEEDS_THRESHOLD) needs.push("blogs");

        const repoKeys = Object.keys(repoMapping);
        const githubFetch: string[] = [];
        const repo_nouls: Record<string, number> = {};
        for (const key of repoKeys) {
          const qKey = `repo_${key.replace(/[^a-z0-9]/gi, "_").toLowerCase()}`;
          const n = extractNoul(answers[qKey]);
          if (n !== undefined) { repo_nouls[key] = n; if (n > REPO_THRESHOLD) githubFetch.push(key); }
        }
        if (githubFetch.length > 0 && !needs.includes("projects")) needs.push("projects");
        const maxNeed = Math.max(n_bio ?? 0, n_exp ?? 0, n_proj ?? 0, n_blogs ?? 0);
        const hasAnySignal = needs.length > 0 || githubFetch.length > 0 || maxNeed > 0.35;

        const is_off = extractNoul(answers.is_off_topic);
        const is_greet = extractNoul(answers.is_greeting);
        const is_urg = extractNoul(answers.is_urgent);
        const is_follow = extractNoul(answers.is_followup);
        const frustAns = answers.frustration as any;
        const compAns = answers.complexity as any;
        jevSignals = {
          is_off_topic_noul: is_off,
          is_greeting_noul: is_greet,
          is_urgent_noul: is_urg,
          is_followup_noul: is_follow,
          frustration_score: frustAns?.type === "score" ? frustAns.score : undefined,
          frustration_probs: frustAns?.probabilities,
          complexity_score: compAns?.type === "score" ? compAns.score : undefined,
          repo_nouls,
        };

        if (hasAnySignal) {
          routerDecision = { needs, githubFetch };
          jevUsed = true;
        } else {
          throw new Error("Jev low confidence");
        }
      } catch (jevErr) {
        console.error("Jev router failed, falling back to Gemini:", jevErr instanceof Error ? jevErr.message : jevErr);
        routerSource = "gemini-fallback";
        try {
          routerDecision = await getGeminiRouterDecision(genAI, trimmedQuery);
          jevUsed = false;
        } catch (geminiErr) {
          console.error("Gemini fallback also failed:", geminiErr);
          routerDecision = { needs: ["bio"], githubFetch: [] };
        }
      }
    } else {
      routerSource = "gemini-fallback";
      try {
        routerDecision = await getGeminiRouterDecision(genAI, trimmedQuery);
      } catch {
        routerDecision = { needs: ["bio"], githubFetch: [] };
      }
    }

    let relevantContext = "";
    if (routerDecision.needs && Array.isArray(routerDecision.needs)) {
      if (routerDecision.needs.includes("bio")) relevantContext += bioData;
      if (routerDecision.needs.includes("experience")) relevantContext += experienceData;
      if (routerDecision.needs.includes("projects")) relevantContext += projectsData;
      if (routerDecision.needs.includes("blogs")) relevantContext += blogsData;
    }
    if (!relevantContext) relevantContext = bioData;

    const isOffTopic = (jevSignals.is_off_topic_noul ?? 0) > OFF_TOPIC_THRESHOLD;

    let githubDetails = "";
    if (Array.isArray(routerDecision.githubFetch) && routerDecision.githubFetch.length > 0) {
      const validRepos = routerDecision.githubFetch.filter((repoName: string) => repoMapping[repoName.toLowerCase()]);
      const fetchPromises = validRepos.map((repoName: string) => getGithubInfo(repoName));
      const results = await Promise.all(fetchPromises);
      results.forEach((info, idx) => {
        if (info && !(info as any).error) {
          const repoName = validRepos[idx].toUpperCase();
          githubDetails += `\nREAL-TIME GITHUB DATA FOR ${repoName}:\n${JSON.stringify(info, null, 2)}\n`;
        }
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });
    let affectGuidance = "";
    if (jevUsed) {
      const urg = jevSignals.is_urgent_noul ?? 0;
      const frust = jevSignals.frustration_score ?? 0;
      const comp = jevSignals.complexity_score ?? 0;
      const greet = jevSignals.is_greeting_noul ?? 0;
      if (urg > 0.70) affectGuidance += "\n- USER IS URGENT (noul " + urg.toFixed(2) + "): Lead with the direct answer FIRST, be concise, then offer details. No fluff.";
      if (frust !== undefined && frust >= 1) {
        if (frust >= 1.5) affectGuidance += "\n- USER IS FRUSTRATED/ANGRY (score " + frust + "): Be extra empathetic, acknowledge their frustration, be concise and solution-oriented, avoid overly cheerful tone.";
        else affectGuidance += "\n- User is mildly impatient: be concise, warm, and prioritize clarity.";
      }
      if (comp !== undefined && comp >= 1.5) affectGuidance += "\n- COMPLEX MULTI-PART QUERY (score " + comp + "): Structure answer with headings/bullets, synthesize across contexts.";
      else if (comp === 0) affectGuidance += "\n- Simple lookup: answer directly and briefly.";
      if (greet > 0.75) affectGuidance += "\n- This is a greeting/small talk: respond warmly and briefly, invite them to ask about Sabari's work.";
      if (jevSignals.is_followup_noul !== undefined && jevSignals.is_followup_noul > 0.65) affectGuidance += "\n- Likely follow-up / vague: infer from context, ask clarifying if truly ambiguous but try to answer helpfully.";
    }

    const systemPrompt = `
      You are the professional digital representative for Sabari Vijayan.
      Your tone should be friendly, conversational, and highly helpful, while maintaining professional integrity.
      CONVERSATIONAL GUIDELINES:
      - Answer questions thoroughly and naturally. Do not be blunt or overly brief.
      - If relevant, naturally weave in a mention that the user can find more comprehensive details in the [/portfolio] or [/experience] sections.
      - Prioritize providing a complete and satisfying answer first rather than just acting as a directory.
      SCOPE & BOUNDARIES:
      - Your primary expertise is Sabari's skills, experience, projects, and background. 
      - If asked about non-portfolio topics (e.g., weather, generic advice, unrelated news), politely decline by gently steering the conversation back to Sabari's work and professional journey.
      ${isOffTopic ? "- CLASSIFIER FLAG: This query was flagged as likely OFF-TOPIC (high confidence). Gently steer back to Sabari's work after a brief polite acknowledgment, do NOT hallucinate unrelated answers." : ""}
      CONVERSATIONAL STATE (from Jev classifier):
      ${jevUsed ? `- Router: Jev (semantic fuzzy) | needs: [${routerDecision.needs.join(", ")}] | urgency: ${jevSignals.is_urgent_noul?.toFixed(2) ?? "n/a"} | frustration: ${jevSignals.frustration_score ?? "n/a"} | complexity: ${jevSignals.complexity_score ?? "n/a"}` : `- Router: Gemini fallback (Jev unavailable/low-confidence)`}
      ${affectGuidance}
      KNOWLEDGE CONTEXT:
      ${relevantContext}
      ${githubDetails}
      INSTRUCTIONS:
      1. Use the knowledge context (including any real-time GitHub data provided) to formulate accurate responses.
      2. If real-time data is available, mention it (e.g., "According to live data, this repo has X stars") to highlight your live connectivity.
      3. Be descriptive. If asked about a project, explain its "why" and "how" based on the available data.
      4. Adapt tone based on CONVERSATIONAL STATE above (urgent/frustrated -> concise & empathetic).
    `;

    const source = githubDetails ? "GITHUB" : "AI";
    const result = await model.generateContentStream(`${systemPrompt}\n\nUser Question: ${trimmedQuery}`);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        controller.enqueue(encoder.encode(JSON.stringify({ source, router: routerSource }) + "\n"));
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) controller.enqueue(encoder.encode(JSON.stringify({ text: chunkText }) + "\n"));
          }
        } catch (e) {
          console.error("Streaming error:", e);
        }
        controller.close();
      },
    });

    return new Response(stream, {
      status: 200,
      headers: { ...headers, 'Content-Type': 'application/x-ndjson', 'Transfer-Encoding': 'chunked' }
    });
  } catch (error) {
    console.error("AI Agent Error:", error instanceof Error ? error.message : error);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) }), { status: 500, headers });
  }
}
