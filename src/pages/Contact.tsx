import React from 'react';

const Contact: React.FC = () => {
  const contactMethods = [
    { label: 'EMAIL', value: 'vijayansabari06@gmail.com', link: 'mailto:vijayansabari06@gmail.com' },
    { label: 'PHONE', value: '+91 8590483660', link: 'tel:+918590483660' },
    { label: 'LINKEDIN', value: 'sabari-vijayan', link: 'https://www.linkedin.com/in/sabari-vijayan-a07107308/' },
    { label: 'GITHUB', value: 'Sabari-Vijayan', link: 'https://github.com/Sabari-Vijayan' },
    { label: 'EXTERNAL', value: 'linktr.ee/sabarivijayan', link: 'https://linktr.ee/sabarivijayan' },
  ];

  return (
    <section className="contact-container">
      <div className="header-meta">
        <span>SABARI VIJAYAN</span>
        <span>ENCRYPTED OR OPEN</span>
      </div>

      <div className="main-grid">
        <aside className="sidebar">
          <h2 className="section-label">REACH OUT</h2>
          <div className="location-box">
            <p className="label">LOCATION</p>
            <p>Pathanamthitta, Kerala, India</p>
          </div>
          <div className="availability-box">
            <p className="label">AVAILABILITY</p>
            <p>Open to collaborations and architectural discussions.</p>
          </div>
        </aside>

        <main className="content">
          <div className="section-intro">
            <h1>Contact</h1>
            <p>Whether you have a question, a project idea, or just want to talk about product nuances and architectural precision—I'm always open to a conversation.</p>
          </div>

          <div className="contact-list">
            <table className="contact-table">
              <tbody>
                {contactMethods.map((method) => (
                  <tr key={method.label}>
                    <td className="row-label">{method.label}</td>
                    <td className="row-data">
                      <a href={method.link} target="_blank" rel="noopener noreferrer" className="text-link">
                        {method.value}
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
        .contact-container { padding: 1rem 0; font-family: 'Newsreader', 'Georgia', 'Times New Roman', serif; }
        
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
          margin-bottom: 2rem;
          letter-spacing: 0.1em;
          font-weight: 700;
        }

        .location-box, .availability-box {
          margin-bottom: 2rem;
          font-size: 0.85rem;
          line-height: 1.5;
        }
        .location-box .label, .availability-box .label {
          font-family: inherit;
          font-size: 0.7rem;
          opacity: 0.5;
          margin-bottom: 0.25rem;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .content { display: flex; flex-direction: column; gap: 4rem; }
        .section-intro h1 { font-size: 2.5rem; margin-bottom: 1rem; letter-spacing: -0.02em; }
        .section-intro p { font-size: 1.1rem; line-height: 1.6; opacity: 0.8; max-width: 600px; }

        .contact-table { width: 100%; border-collapse: collapse; }
        .contact-table tr { border-bottom: 1px solid var(--border-color); }
        .contact-table tr:last-child { border-bottom: none; }
        .row-label {
          padding: 1rem 0;
          font-family: inherit;
          font-size: 0.85rem;
          width: 140px;
          opacity: 0.6;
          vertical-align: middle;
          font-weight: 600;
        }
        .row-data { padding: 1rem 0; font-weight: 500; font-size: 1.1rem; }

        .text-link {
          color: var(--text-color);
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: all 0.2s;
        }
        .text-link:hover {
          color: var(--accent-color);
          border-bottom: 1px solid var(--accent-color);
        }

        @media (max-width: 850px) {
          .main-grid { grid-template-columns: 1fr; gap: 3rem; }
          .sidebar { order: -1; display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; border-bottom: 1px solid var(--border-color); padding-bottom: 2rem; }
          .section-label { grid-column: 1 / -1; margin-bottom: 0; }
          .row-label { width: 100px; font-size: 0.75rem; }
          .row-data { font-size: 0.95rem; }
          .header-meta { font-size: 0.65rem; }
          .section-intro h1 { font-size: 2rem; }
        }
      `}</style>
    </section>
  );
};

export default Contact;
