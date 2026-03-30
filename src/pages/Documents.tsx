import React, { useState } from 'react';

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
        }
      `}</style>
    </section>
  );
};

export default Documents;
