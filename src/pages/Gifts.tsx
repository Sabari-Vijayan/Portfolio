import React from 'react';
import { gifts } from '../data/gifts';

const Gifts: React.FC = () => {
  return (
    <section className="gifts-container">
      <div className="header-meta">
        <span>SABARI VIJAYAN</span>
        <span>GIFT GUIDE</span>
      </div>

      <div className="section-intro">
        <h1>What to gift me</h1>
        <p>A short, honest list for anyone wondering what to get me. Anything here gets used, not shelved.</p>
      </div>

      <table className="gifts-table">
        <tbody>
          {gifts.map((gift) => (
            <tr key={gift.id}>
              <td className="row-main">{gift.name}</td>
              <td className="row-note">{gift.note}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <style>{`
        .gifts-container { padding: 1rem 0; font-family: 'Newsreader', 'Georgia', 'Times New Roman', serif; }

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

        .section-intro h1 { font-size: 2.5rem; margin-bottom: 1rem; letter-spacing: -0.02em; }
        .section-intro p { font-size: 1.1rem; line-height: 1.6; opacity: 0.8; max-width: 600px; margin-bottom: 3rem; }

        .gifts-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
        .gifts-table td { padding: 1.25rem 0; border-bottom: 1px solid var(--border-color); vertical-align: top; }
        .gifts-table tr:last-child td { border-bottom: none; }
        .row-main { font-weight: 600; font-size: 1rem; width: 240px; }
        .row-note { font-size: 0.9rem; opacity: 0.8; line-height: 1.5; }

        @media (max-width: 850px) {
          .header-meta { font-size: 0.65rem; }
          .section-intro h1 { font-size: 2rem; }
          .gifts-table td { display: block; padding: 0; border-bottom: none; }
          .gifts-table tr { display: block; padding: 1.25rem 0; border-bottom: 1px solid var(--border-color); }
          .gifts-table tr:last-child { border-bottom: none; }
          .row-main { width: auto; margin-bottom: 0.25rem; }
        }
      `}</style>
    </section>
  );
};

export default Gifts;
