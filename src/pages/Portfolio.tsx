import React, { useState } from 'react';

type Category = 'All' | 'Project' | 'Design' | 'Paper';

interface PortfolioItem {
  id: number;
  title: string;
  category: Category;
  description: string;
  link: string;
  date?: string;
}

const Portfolio: React.FC = () => {
  const [filter, setFilter] = useState<Category>('All');

  const items: PortfolioItem[] = [
    {
      id: 1,
      title: 'E-commerce Platform',
      category: 'Project',
      description: 'A full-stack e-commerce solution built with React and Node.js.',
      link: '#',
    },
    {
      id: 2,
      title: 'Brand Identity Design',
      category: 'Design',
      description: 'Complete visual identity for a local startup, including logo and color palette.',
      link: '#',
    },
    {
      id: 3,
      title: 'Machine Learning Research',
      category: 'Paper',
      description: 'A research paper on optimizing neural networks for edge devices.',
      link: '#',
      date: '2025'
    },
    {
      id: 4,
      title: 'Mobile Weather App',
      category: 'Project',
      description: 'A responsive weather application using OpenWeather API.',
      link: '#',
    },
    {
      id: 5,
      title: 'Minimalist Portfolio UI',
      category: 'Design',
      description: 'A clean, accessible UI/UX design focused on typography and white space.',
      link: '#',
    },
  ];

  const filteredItems = filter === 'All' 
    ? items 
    : items.filter(item => item.category === filter);

  const categories: Category[] = ['All', 'Project', 'Design', 'Paper'];

  return (
    <section>
      <h1>Portfolio</h1>
      <p style={{ marginBottom: '2rem' }}>A collection of my work, ranging from full-stack projects to academic research and visual design.</p>

      <div className="filter-container">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`filter-btn ${filter === cat ? 'active' : ''}`}
            aria-pressed={filter === cat}
          >
            {cat}s
          </button>
        ))}
      </div>

      <div className="portfolio-grid">
        {filteredItems.map(item => (
          <article key={item.id} className="portfolio-card">
            <div className="card-header">
              <span className="category-tag">{item.category}</span>
              {item.date && <span className="date-tag">{item.date}</span>}
            </div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <a href={item.link} aria-label={`View details for ${item.title}`}>View Details &rarr;</a>
          </article>
        ))}
      </div>

      <style>{`
        .filter-container {
          display: flex;
          gap: 1rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }

        .filter-btn {
          background: none;
          border: 1px solid var(--border-color);
          color: var(--text-color);
          padding: 0.5rem 1.25rem;
          border-radius: 20px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .filter-btn:hover {
          border-color: var(--accent-color);
          color: var(--accent-color);
        }

        .filter-btn.active {
          background-color: var(--accent-color);
          border-color: var(--accent-color);
          color: #ffffff;
        }

        .portfolio-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .portfolio-card {
          border: 1px solid var(--border-color);
          padding: 1.5rem;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .portfolio-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .category-tag {
          color: var(--accent-color);
        }

        .date-tag {
          color: var(--text-color);
          opacity: 0.6;
        }

        .portfolio-card h3 {
          margin-bottom: 0.75rem;
        }

        .portfolio-card p {
          flex: 1;
          font-size: 0.95rem;
          opacity: 0.9;
          margin-bottom: 1.5rem;
        }

        .portfolio-card a {
          font-weight: 600;
          font-size: 0.9rem;
        }
      `}</style>
    </section>
  );
};

export default Portfolio;
