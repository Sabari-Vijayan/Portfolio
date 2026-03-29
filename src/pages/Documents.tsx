import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Send, Bot, Loader2 } from 'lucide-react';

type DocType = 'ALL' | 'CERTIFICATE' | 'IDENTITY';

interface DocumentItem {
  id: number;
  name: string;
  type: DocType;
  issuer: string;
  date: string;
  path: string;
}

const Documents: React.FC = () => {
  const [filter, setFilter] = useState<DocType>('ALL');
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const profileContext = `
    You are an AI assistant for Sabari Vijayan's portfolio. 
    Bio: B.Tech Computer Science student at RIT Kottayam (2023-2027). Based in Pathanamthitta, Kerala.
    Passions: Overanalyzing products, precision in software architecture, Apple-inspired design.
    Volunteering: Campus Lead at TinkerHub RIT (Jun 2025 - Present).
    Projects:
    - SmartPlace: Placement management system (React, Express, Supabase, Redis).
    - Tinkerfetch: System info tool skin.
    - KTU Status Tracker: Uptime monitor for university site.
    - Code-A-Pookalam 2025: Official website for competition.
    - Christmas Secret Messages: Anonymous messaging platform.
    - CarTinder: MERN stack car discovery app.
    - TinkerHub Ghost: Custom CMS theme.
    - Gemini-CLI-Skills: Repository of CLI skill definitions.
    Tech Stack: React, Next.js, Node.js, TypeScript, Python, C, Docker, Linux, Git.
    Principles: SOLID, Clean Architecture, WCAG AAA accessibility.
    Tone: Professional, precise, minimalist, and helpful.
  `;

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setResponse("API Key missing. Please configure VITE_GEMINI_API_KEY in environment variables.");
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
      
      const prompt = `Context: ${profileContext}\n\nUser Question: ${query}\n\nAnswer concisely and professionally.`;
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      setResponse(text);
    } catch (error) {
      console.error("AI Error:", error);
      setResponse("Error connecting to the AI. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (response) chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [response]);

  const docs: DocumentItem[] = [
    {
      id: 1,
      name: 'Professional Resume',
      type: 'IDENTITY',
      issuer: 'Self',
      date: '2026.03',
      path: '/documents/Sabari-Vijayan-Resume.pdf'
    },
    {
      id: 2,
      name: 'AI Fluency (Anthropic)',
      type: 'CERTIFICATE',
      issuer: 'Anthropic',
      date: '2025.10',
      path: '/documents/certificates/AI-Fluency-Anthropic.pdf'
    }
  ];

  const filteredDocs = filter === 'ALL' 
    ? docs 
    : docs.filter(doc => doc.type === filter);

  const categories: DocType[] = ['ALL', 'CERTIFICATE', 'IDENTITY'];

  return (
    <section className="docs-container">
      <div className="header-meta">
        <span>SABARI VIJAYAN</span>
        <span>VERIFIED CREDENTIALS</span>
      </div>

      <div className="ai-assistant-section">
        <div className="ai-card">
          <div className="ai-header">
            <Bot size={18} />
            <span>PORTFOLIO INTELLIGENCE</span>
          </div>
          <form onSubmit={handleAsk} className="ai-input-group">
            <input 
              type="text" 
              placeholder="Ask me about Sabari's projects, skills, or experience..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
            />
            <button type="submit" disabled={loading || !query.trim()}>
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
            </button>
          </form>
          {response && (
            <div className="ai-response">
              <div className="response-header">
                <Bot size={14} /> <span>RESPONSE</span>
              </div>
              <p>{response}</p>
              <div ref={chatEndRef} />
            </div>
          )}
        </div>
      </div>

      <div className="main-grid">
        <aside className="sidebar">
          <h2 className="section-label">DOC TYPE</h2>
          <div className="filter-list">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`filter-link ${filter === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </aside>

        <main className="content">
          <div className="section-intro">
            <h1>Credentials</h1>
            <p>A verified log of academic certifications and technical identity documents, available for immediate archival access.</p>
          </div>

          <div className="docs-list">
            <table className="docs-table">
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>DOCUMENT NAME</th>
                  <th>ISSUER</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.map((doc) => (
                  <tr key={doc.id}>
                    <td className="row-meta">{doc.date}</td>
                    <td className="row-main">{doc.name}</td>
                    <td className="row-meta">{doc.issuer}</td>
                    <td className="row-link">
                      <a 
                        href={doc.path} 
                        download 
                        className="text-link"
                        title={`Download ${doc.name}`}
                      >
                        ↓ DOWNLOAD PDF
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      <style>{`
        .docs-container { padding: 1rem 0; font-family: 'Newsreader', 'Georgia', 'Times New Roman', serif; }
        
        .header-meta {
          display: flex;
          justify-content: space-between;
          font-family: inherit;
          font-size: 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 3rem;
          opacity: 0.6;
          letter-spacing: 0.05em;
        }

        /* AI Assistant Styling */
        .ai-assistant-section {
          margin-bottom: 4rem;
        }
        .ai-card {
          border: 1px solid var(--border-color);
          padding: 1.5rem;
          background: var(--nav-bg);
          border-radius: 4px;
        }
        .ai-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--accent-color);
          margin-bottom: 1rem;
          letter-spacing: 0.1em;
        }
        .ai-input-group {
          display: flex;
          gap: 1rem;
        }
        .ai-input-group input {
          flex: 1;
          background: var(--bg-color);
          border: 1px solid var(--border-color);
          padding: 0.75rem 1rem;
          color: var(--text-color);
          font-family: inherit;
          font-size: 0.95rem;
          outline: none;
        }
        .ai-input-group input:focus {
          border-color: var(--accent-color);
        }
        .ai-input-group button {
          background: var(--accent-color);
          color: white;
          border: none;
          padding: 0 1.5rem;
          cursor: pointer;
          transition: opacity 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ai-input-group button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .ai-response {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border-color);
          animation: fade-in 0.3s ease;
        }
        .response-header {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.65rem;
          opacity: 0.5;
          margin-bottom: 0.5rem;
          font-weight: 700;
        }
        .ai-response p {
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--text-color);
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .main-grid {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 4rem;
        }

        .section-label {
          font-family: inherit;
          font-size: 0.75rem;
          color: var(--accent-color);
          margin-bottom: 1.5rem;
          letter-spacing: 0.1em;
          font-weight: 700;
        }

        .filter-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .filter-link {
          background: none;
          border: none;
          color: var(--text-color);
          font-family: inherit;
          font-size: 0.85rem;
          text-align: left;
          padding: 0.25rem 0;
          cursor: pointer;
          opacity: 0.6;
          transition: opacity 0.2s;
          width: fit-content;
          border-bottom: 1px solid transparent;
          letter-spacing: 0.02em;
        }
        .filter-link:hover, .filter-link.active { opacity: 1; color: var(--accent-color); }
        .filter-link.active { border-bottom: 1px solid var(--accent-color); font-weight: 700; }

        .content { display: flex; flex-direction: column; gap: 4rem; }
        .section-intro h1 { font-size: 2.5rem; margin-bottom: 1rem; letter-spacing: -0.02em; }
        .section-intro p { font-size: 1.1rem; line-height: 1.6; opacity: 0.8; max-width: 600px; }

        .docs-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
        .docs-table th { 
          text-align: left; 
          font-family: inherit; 
          font-size: 0.7rem; 
          opacity: 0.5; 
          padding-bottom: 1rem; 
          border-bottom: 1px solid var(--border-color);
          letter-spacing: 0.05em;
          font-weight: 700;
        }
        .docs-table td { padding: 1.25rem 0; border-bottom: 1px solid var(--border-color); }
        .row-meta { font-family: inherit; font-size: 0.8rem; opacity: 0.6; letter-spacing: 0.02em; }
        .row-main { font-weight: 600; font-size: 1rem; }
        
        .text-link {
          font-family: inherit;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--accent-color);
          text-decoration: none;
        }
        .text-link:hover { text-decoration: underline; }

        @media (max-width: 850px) {
          .main-grid { grid-template-columns: 1fr; gap: 3rem; }
          .sidebar { order: -1; }
          .filter-list { flex-direction: row; flex-wrap: wrap; gap: 1.5rem; }
          .docs-table th:nth-child(3) { display: none; }
          .docs-table td:nth-child(3) { display: none; }
          .header-meta { font-size: 0.65rem; }
          .section-intro h1 { font-size: 2rem; }
          .ai-input-group { flex-direction: column; }
          .ai-input-group button { padding: 0.75rem; }
        }
      `}</style>
    </section>
  );
};

export default Documents;
