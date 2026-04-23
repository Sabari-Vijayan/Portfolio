
import React from 'react';
import { Link } from 'react-router-dom';

const Experience: React.FC = () => {
  const education = [
    {
      title: 'B.Tech in Computer Science',
      institution: 'Government Engineering College (RIT), Kottayam',
      period: '2023 — Present',
      description: 'Focusing on core computer science principles, software engineering, and modern web technologies. Maintaining a strong focus on clean architecture and performance.',
      isCurrent: true
    },
    {
      title: 'Higher Secondary (12th Grade)',
      institution: 'IHRD Syllabus',
      period: '2021 — 2023',
      description: 'Specialized in Computer Science and Mathematics.',
      isCurrent: false
    },
    {
      title: 'Secondary School (10th Grade)',
      institution: 'Bethany Academy, Vennikulam',
      period: 'ICSE Syllabus, 2021',
      description: 'Completed with a focus on holistic academic excellence.',
      isCurrent: false
    }
  ];

  const volunteering = [
    {
      role: 'Campus Lead',
      organization: 'TinkerHub RIT',
      period: 'Jun 2025 — Present',
      description: 'Leading the RIT Campus Chapter. Fostering a culture of technology, open-source contribution, and innovation within the student community.',
      isCurrent: true
    }
  ];

  return (
    <section className="experience-page">
      {/* Professional Status / Open to Work */}
      <div className="status-section">
        <div className="status-header">
          <h2 className="section-title">Professional Status</h2>
          <div className="badge-wrapper">
            <span className="work-badge">Open to Work</span>
          </div>
        </div>
        <div className="status-content">
          <p className="status-lead">
            Seeking <strong>Internships</strong> or <strong>Part-time Roles</strong> to apply my expertise in Software Architecture and Full-stack Development.
          </p>
          <div className="skills-tags">
            {['React/TS', 'Node.js', 'Clean Architecture', 'System Design', 'UI/UX'].map(skill => (
              <span key={skill} className="skill-tag">{skill}</span>
            ))}
          </div>
          
          <div className="hire-button-wrapper">
            <Link to="/contact" className="hire-btn">HIRE ME</Link>
          </div>
        </div>
      </div>

      {/* Timeline Sections */}
      <div className="timeline-container">
        <div className="timeline-group">
          <h2 className="section-title">Education</h2>
          <div className="timeline-list">
            {education.map((item, index) => (
              <div key={index} className={`timeline-item ${item.isCurrent ? 'current-edu' : ''}`}>
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <div className="item-header">
                    <h3 className="item-title">{item.title}</h3>
                    <span className="item-period">{item.period}</span>
                  </div>
                  <h4 className="item-sub">{item.institution}</h4>
                  <p className="item-desc">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="timeline-group">
          <h2 className="section-title">Volunteering</h2>
          <div className="timeline-list">
            {volunteering.map((item, index) => (
              <div key={index} className={`timeline-item ${item.isCurrent ? 'current-vol' : ''}`}>
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <div className="item-header">
                    <h3 className="item-title">{item.role}</h3>
                    <span className="item-period">{item.period}</span>
                  </div>
                  <h4 className="item-sub">{item.organization}</h4>
                  <p className="item-desc">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .experience-page {
          max-width: 800px;
          margin: 0 auto;
          padding-bottom: 4rem;
        }

        .page-title {
          font-size: 2.8rem;
          margin-bottom: 3.5rem;
          border-left: 5px solid var(--accent-color);
          padding-left: 1.5rem;
          font-family: 'Newsreader', serif;
          font-weight: 800;
        }

        .section-title {
          font-size: 1.1rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--accent-color);
          margin-bottom: 1.5rem;
          font-family: sans-serif;
          font-weight: 800;
        }

        /* Status Section */
        .status-section {
          background: transparent;
          padding: 3rem 1.5rem;
          border-radius: 4px;
          border: 1px solid var(--border-color);
          margin-bottom: 5rem;
          text-align: center;
          position: relative;
        }

        .status-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .status-header .section-title {
          margin-bottom: 0;
        }

        .work-badge {
          background: transparent;
          color: var(--accent-color);
          padding: 0.4rem 1.2rem;
          border: 1px solid var(--accent-color);
          border-radius: 2px;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          font-family: sans-serif;
        }

        .status-lead {
          font-size: 1.3rem;
          line-height: 1.6;
          margin-bottom: 2rem;
          font-family: 'Newsreader', serif;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          color: var(--text-color);
        }

        .skills-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          justify-content: center;
          margin-bottom: 2.5rem;
        }

        .skill-tag {
          font-size: 0.8rem;
          padding: 0.4rem 0.8rem;
          background: var(--nav-bg);
          border: 1px solid var(--border-color);
          border-radius: 2px;
          font-weight: 600;
          font-family: sans-serif;
          font-variant: small-caps;
          color: var(--text-color);
          opacity: 0.8;
        }

        .hire-button-wrapper {
          display: flex;
          justify-content: center;
        }

        .hire-btn {
          background: var(--accent-color);
          color: var(--bg-color) !important;
          padding: 0.8rem 2.5rem;
          border-radius: 4px;
          font-weight: 800;
          text-decoration: none;
          font-size: 0.9rem;
          letter-spacing: 0.1em;
          transition: transform 0.2s, opacity 0.2s;
          display: inline-block;
        }

        .hire-btn:visited {
          color: var(--bg-color) !important;
        }


        .hire-btn:hover {
          transform: translateY(-2px);
          opacity: 0.9;
        }

        /* Timeline Styles */
        .timeline-container {
          display: flex;
          flex-direction: column;
          gap: 4.5rem;
        }

        .timeline-list {
          position: relative;
          padding-left: 2.5rem;
          border-left: 2px solid var(--border-color);
          margin-left: 0.5rem;
        }

        .timeline-item {
          position: relative;
          margin-bottom: 3.5rem;
          padding: 1.5rem;
          border-radius: 8px;
          transition: background-color 0.3s ease;
        }

        .timeline-item:last-child {
          margin-bottom: 0;
        }

        /* Highlights for Current Items */
        .timeline-item.current-edu {
          background-color: rgba(var(--accent-rgb, 0, 86, 179), 0.05);
          border: 1px solid rgba(var(--accent-rgb, 0, 86, 179), 0.1);
        }

        .timeline-item.current-vol {
          background-color: rgba(var(--accent-rgb, 0, 86, 179), 0.03);
          border: 1px dashed rgba(var(--accent-rgb, 0, 86, 179), 0.2);
        }

        .timeline-dot {
          position: absolute;
          left: -2.95rem;
          top: 2rem;
          width: 12px;
          height: 12px;
          background: var(--bg-color);
          border: 2px solid var(--accent-color);
          border-radius: 50%;
          z-index: 2;
        }

        .current-edu .timeline-dot, .current-vol .timeline-dot {
          background: var(--accent-color);
          box-shadow: 0 0 0 4px rgba(var(--accent-rgb, 0, 86, 179), 0.1);
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 0.25rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .item-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
          font-family: 'Newsreader', serif;
        }

        .item-period {
          font-size: 0.85rem;
          font-family: sans-serif;
          color: var(--accent-color);
          font-weight: 700;
          background: var(--nav-bg);
          padding: 0.2rem 0.6rem;
          border-radius: 2px;
          border: 1px solid var(--border-color);
        }

        .item-sub {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-color);
          opacity: 0.8;
          margin-bottom: 0.75rem;
        }

        .item-desc {
          font-size: 1.05rem;
          opacity: 0.75;
          max-width: 650px;
          line-height: 1.7;
        }

        @media (max-width: 640px) {
          .item-header { flex-direction: column; gap: 0.5rem; }
          .page-title { font-size: 2.2rem; }
          .status-lead { font-size: 1.15rem; }
          .timeline-list { padding-left: 1.5rem; }
          .timeline-dot { left: -1.95rem; }
          .timeline-item { padding: 1rem; }
        }
      `}</style>
    </section>
  );
};

export default Experience;
