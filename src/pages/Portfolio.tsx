import React, { useState } from 'react';

type Category = 'ALL' | 'PROJECT' | 'DESIGN' | 'PAPER';

interface PortfolioItem {
  id: number;
  title: string;
  category: Category;
  description: string;
  link: string;
  date?: string;
}

const Portfolio: React.FC = () => {
  const [filter, setFilter] = useState<Category>('ALL');

  const items: PortfolioItem[] = [
    {
      id: 1,
      title: 'SmartPlace',
      category: 'PROJECT',
      description: 'A self-hostable placement management system for colleges. Built with React/Vite, Express, Supabase, and Redis.',
      link: 'https://github.com/Sabari-Vijayan/SmartPlace',
    },
    {
      id: 2,
      title: 'Tinkerfetch',
      category: 'PROJECT',
      description: 'A custom system info tool (Fastfetch skin) with a dedicated mode for tracking community events.',
      link: 'https://github.com/Sabari-Vijayan/tinkerfetch.git',
    },
    {
      id: 3,
      title: 'KTU Status Tracker',
      category: 'PROJECT',
      description: 'Uptime monitor for the KTU website built using Upptime and GitHub Actions.',
      link: 'https://status.app.ktu.in',
    },
    {
      id: 4,
      title: 'Code-A-Pookalam 2025',
      category: 'PROJECT',
      description: 'Official website for the TinkerHub RIT competition.',
      link: 'https://github.com/Sabari-Vijayan/CODE-A-POOKALAM-2025-COMPETITION.git',
    },
    {
      id: 5,
      title: 'Christmas Secret Messages',
      category: 'PROJECT',
      description: 'An anonymous messaging platform where gifts (messages) are unlocked strictly on Christmas Day. (Supabase/React).',
      link: 'https://github.com/Sabari-Vijayan/christmas.git',
    },
    {
      id: 6,
      title: 'CarTinder',
      category: 'PROJECT',
      description: 'A MERN stack application applying the "swipe" discovery mechanic to car listings.',
      link: 'https://github.com/Sabari-Vijayan/cartinder.git',
    },
    {
      id: 7,
      title: 'TinkerHub Ghost',
      category: 'DESIGN',
      description: 'Custom Ghost CMS theme developed for TinkerHub RIT during the Ghosted Hackathon.',
      link: 'https://github.com/Sabari-Vijayan/tinkerhub-ghost.git',
    },
    {
      id: 8,
      title: 'Gemini-CLI-Skills',
      category: 'PROJECT',
      description: 'A specialized repository of .md skill definitions to enhance Gemini CLI workflows.',
      link: 'https://github.com/Sabari-Vijayan/Gemini-CLI-Skills.git',
    },
  ];

  const filteredItems = filter === 'ALL' 
    ? items 
    : items.filter(item => item.category === filter);

  const categories: Category[] = ['ALL', 'PROJECT', 'DESIGN', 'PAPER'];

  return (
    <section className="portfolio-container">
      <div className="header-meta">
        <span>SABARI VIJAYAN</span>
        <span>INDEXED BY CATEGORY</span>
      </div>

      <div className="main-grid">
        <aside className="sidebar">
          <h2 className="section-label">FILTER BY</h2>
          <div className="filter-list">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`filter-link ${filter === cat ? 'active' : ''}`}
                aria-pressed={filter === cat}
              >
                {cat}
              </button>
            ))}
          </div>
        </aside>

        <main className="content">
          <div className="section-intro">
            <h1>Selected Works</h1>
            <p>A technical log of projects, research papers, and design systems developed with a focus on structural integrity and user precision.</p>
          </div>

          <div className="project-list">
            {filteredItems.map(item => (
              <article key={item.id} className="project-row">
                <div className="project-meta">
                  <span className="project-category">{item.category}</span>
                  {item.date && <span className="project-date">[{item.date}]</span>}
                </div>
                <div className="project-main">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <a href={item.link} className="text-link" target="_blank" rel="noopener noreferrer">→ ACCESS REPOSITORY</a>
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>

      <style>{`
        .portfolio-container { padding: 1rem 0; font-family: 'Newsreader', 'Georgia', 'Times New Roman', serif; }
        
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

        .project-list { display: flex; flex-direction: column; }
        .project-row {
          display: grid;
          grid-template-columns: 140px 1fr;
          gap: 2rem;
          padding: 2rem 0;
          border-bottom: 1px solid var(--border-color);
        }
        .project-row:first-child { padding-top: 0; }
        
        .project-meta {
          font-family: inherit;
          font-size: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          opacity: 0.6;
          padding-top: 0.5rem;
          letter-spacing: 0.02em;
        }

        .project-main h3 { font-size: 1.25rem; margin-bottom: 0.5rem; font-weight: 700; }
        .project-main p { font-size: 1rem; opacity: 0.8; margin-bottom: 1rem; line-height: 1.5; }

        .text-link {
          font-family: inherit;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--accent-color);
          text-decoration: none;
        }
        .text-link:hover { text-decoration: underline; }

        @media (max-width: 850px) {
          .main-grid { grid-template-columns: 1fr; gap: 3rem; }
          .sidebar { order: -1; }
          .filter-list { flex-direction: row; flex-wrap: wrap; gap: 1.5rem; }
          .project-row { grid-template-columns: 1fr; gap: 1rem; }
          .project-meta { flex-direction: row; gap: 1rem; padding-top: 0; }
          .header-meta { font-size: 0.65rem; }
          .section-intro h1 { font-size: 2rem; }
        }
      `}</style>
    </section>
  );
};

export default Portfolio;
