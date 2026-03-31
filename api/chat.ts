import { GoogleGenerativeAI } from '@google/generative-ai';

export const config = {
  runtime: 'edge', // Using Edge runtime for faster performance
};

export default async function handler(req: Request) {
  // 1. Handle CORS (Allow GitHub Pages, Vercel, and Localhost)
  const allowedOrigins = [
    'https://sabari-vijayan.github.io',
    'https://portfolio-liard-alpha-anenqdv7wr.vercel.app',
    'http://localhost:5173', // Default Vite port
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

  // 2. Handle preflight (OPTIONS) request
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  // 3. Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers });
  }

  try {
    const { query } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API Key missing on server' }), { status: 500, headers });
    }

    const profileContext = `
      You are an AI assistant for Sabari Vijayan's portfolio. 
      Bio: B.Tech Computer Science student at RIT Kottayam (2023-2027). Based in Pathanamthitta, Kerala.
      Passions: Overanalyzing products, precision in software architecture, Apple-inspired design.
      Volunteering: Campus Lead at TinkerHub RIT (Jun 2025 - Present).
      Projects: SmartPlace, Tinkerfetch, KTU Status Tracker, Code-A-Pookalam 2025, Christmas Secret Messages, CarTinder, TinkerHub Ghost, Gemini-CLI-Skills.
      Tech Stack: React, Next.js, Node.js, TypeScript, Python, C, Docker, Linux, Git.
      Principles: SOLID, Clean Architecture, WCAG AAA accessibility.
      Tone: Professional, precise, minimalist, and helpful.
    `;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" }); // or "gemini-3-flash-preview"
    
    const prompt = `Context: ${profileContext}\n\nUser Question: ${query}\n\nAnswer concisely and professionally.`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return new Response(JSON.stringify({ text }), { status: 200, headers });
  } catch (error) {
    console.error("AI Error:", error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers });
  }
}
