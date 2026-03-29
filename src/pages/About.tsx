import React from 'react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  const techStack = [
    { category: 'FRONTEND', items: 'React, Next.js, TypeScript' },
    { category: 'BACKEND', items: 'Node.js, Express, Python, C' },
    { category: 'SYSTEMS', items: 'Docker, Linux, Git' },
    { category: 'PRINCIPLES', items: 'SOLID, Clean Architecture, WCAG AAA' },
  ];

  return (
    <section className="home-container">
      <div className="header-meta">
        <span>SABARI VIJAYAN</span>
        <span>PATHANAMTHITTA, IN</span>
      </div>

      <div className="main-grid">
        <aside className="sidebar">
          <div className="image-frame">
            <img 
              src="/profile-long.png" 
              alt="Sabari Vijayan" 
              className="profile-image"
            />
          </div>
          <div className="sidebar-links">
            <a href="https://github.com/Sabari-Vijayan" target="_blank" rel="noopener noreferrer">GITHUB</a>
            <a href="https://www.linkedin.com/in/sabari-vijayan-a07107308/" target="_blank" rel="noopener noreferrer">LINKEDIN</a>
            <a href="/documents/Sabari-Vijayan-Resume.pdf" download>RESUME.PDF</a>
          </div>
        </aside>

        <main className="content">
          <section className="manifesto">
            <h1>Refining the details that matter.</h1>
            <p>
              I have a passion for overanalyzing products and obsessing over the smallest nuances. 
              I deeply admire the elegance with which <strong>Apple</strong> approaches design, 
              and I strive to bring that same level of <strong>precision and perfection</strong> to every piece of software I architect.
            </p>
          </section>

          <section className="data-table">
            <h2 className="section-label">TECHNICAL CAPABILITIES</h2>
            <table className="tech-table">
              <tbody>
                {techStack.map((stack) => (
                  <tr key={stack.category}>
                    <td className="row-label">{stack.category}</td>
                    <td className="row-data">{stack.items}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="current-project">
            <h2 className="section-label">CURRENT VECTOR</h2>
            <div className="project-brief">
              <p>
                Architecting a comprehensive Wikipedia for APJKTU University students. 
                Knowledge distribution at zero cost.
              </p>
              <Link to="/portfolio" className="text-link">→ VIEW PROJECT HUB</Link>
            </div>
          </section>
        </main>
      </div>

      <style>{`
        .home-container { 
          padding: 1rem 0; 
          font-family: 'Newsreader', 'Georgia', 'Times New Roman', serif;
        }

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

        /* Sidebar Styling */
        .sidebar { display: flex; flex-direction: column; gap: 1.5rem; }
        .image-frame {
          border: 1px solid var(--border-color);
          padding: 4px;
          background: var(--bg-color);
        }
        .profile-image {
          width: 100%;
          height: auto;
          display: block;
          filter: grayscale(100%);
          transition: filter 0.3s ease;
        }
        .profile-image:hover { filter: grayscale(0%); }
        
        .sidebar-links {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          font-family: inherit;
          font-size: 0.85rem;
          letter-spacing: 0.02em;
        }
        .sidebar-links a {
          color: var(--text-color);
          text-decoration: none;
          padding: 0.25rem 0;
          border-bottom: 1px solid transparent;
          width: fit-content;
        }
        .sidebar-links a:hover {
          color: var(--accent-color);
          border-bottom: 1px solid var(--accent-color);
        }

        /* Content Styling */
        .content { display: flex; flex-direction: column; gap: 4rem; }
        
        .manifesto h1 {
          font-size: 2.5rem;
          font-weight: 700;
          letter-spacing: -0.03em;
          margin-bottom: 1.5rem;
          line-height: 1.1;
        }
        .manifesto p {
          font-size: 1.1rem;
          line-height: 1.6;
          max-width: 550px;
          opacity: 0.9;
        }

        .section-label {
          font-family: inherit;
          font-size: 0.75rem;
          color: var(--accent-color);
          margin-bottom: 1rem;
          letter-spacing: 0.1em;
          font-weight: 700;
        }

        /* Table Styling */
        .tech-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }
        .tech-table tr {
          border-bottom: 1px solid var(--border-color);
        }
        .tech-table tr:last-child { border-bottom: none; }
        .row-label {
          padding: 0.75rem 0;
          font-family: inherit;
          width: 140px;
          opacity: 0.6;
          vertical-align: top;
          font-weight: 600;
        }
        .row-data {
          padding: 0.75rem 0;
          font-weight: 500;
        }

        .project-brief p {
          margin-bottom: 1rem;
          font-size: 1rem;
          line-height: 1.6;
        }
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
          .sidebar { flex-direction: column; align-items: center; gap: 1.5rem; }
          .image-frame { width: 220px; }
          .sidebar-links { align-items: center; flex-direction: row; flex-wrap: wrap; justify-content: center; gap: 1.5rem; }
          .manifesto h1 { font-size: 2rem; text-align: center; }
          .manifesto p { text-align: center; margin: 0 auto; }
          .header-meta { font-size: 0.65rem; }
        }
      `}</style>
    </section>
  );
};

export default About;
