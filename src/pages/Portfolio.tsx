import React, { useState } from 'react';
import { projectList } from '../data/projects';

type Category = 'ALL' | 'PROJECT' | 'DESIGN' | 'PAPER';

interface PortfolioItem {
  id: number;
  title: string;
  category: Category;
  description: string;
  link: string;
  date?: string;
  stars?: number;
}

const Portfolio: React.FC = () => {
  const [filter, setFilter] = useState<Category>('ALL');

  // Manual items for things that aren't on GitHub or need specific curation
  const manualItems: PortfolioItem[] = [
    {
      id: 1001,
      title: 'TinkerHub Ghost',
      category: 'DESIGN',
      description: 'Custom Ghost CMS theme developed for TinkerHub RIT during the Ghosted Hackathon.',
      link: 'https://github.com/Sabari-Vijayan/tinkerhub-ghost.git',
    },
  ];

  // Merge automated GitHub projects with manual items
  // We filter out any automated project that is already in manualItems to avoid duplicates
  const items: PortfolioItem[] = [
    ...manualItems,
    ...(projectList as PortfolioItem[]).filter(p => !manualItems.some(m => m.title.toLowerCase() === p.title.toLowerCase()))
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
                  {item.stars !== undefined && item.stars > 0 && (
                    <span className="project-stars">★ {item.stars}</span>
                  )}
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

        .project-stars {
          color: var(--accent-color);
          font-weight: 700;
          opacity: 1;
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
