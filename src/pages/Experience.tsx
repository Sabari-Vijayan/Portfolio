import React from 'react';

const Experience: React.FC = () => (
  <section>
    <h1>Experience & Education</h1>
    
    <div className="section">
      <h2 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginTop: '2rem' }}>Education</h2>
      <article style={{ margin: '1.5rem 0' }}>
        <h3>B.Tech in Computer Science</h3>
        <p><strong>Government Engineering College (RIT), Kottayam</strong> | <em>2023 — Present</em></p>
        <p>Currently pursuing a Bachelor of Technology, focusing on core computer science principles, software engineering, and modern technologies.</p>
      </article>
      <article style={{ margin: '1.5rem 0' }}>
        <h3>Higher Secondary (12th Grade)</h3>
        <p><strong>IHRD Syllabus</strong> | <em>2021 — 2023</em></p>
      </article>
      <article style={{ margin: '1.5rem 0' }}>
        <h3>Secondary School (10th Grade)</h3>
        <p><strong>Bethany Academy, Vennikulam</strong> | <em>ICSE Syllabus, 2021</em></p>
      </article>
    </div>

    <div className="section" style={{ marginTop: '3rem' }}>
      <h2 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Work Experience</h2>
      <article style={{ margin: '1.5rem 0' }}>
        <h3>[Job Title] @ [Company Name]</h3>
        <p><em>[Date Range]</em></p>
        <ul>
          <li>Summary of your impact and key responsibilities in this role.</li>
        </ul>
      </article>
    </div>

    <div className="section" style={{ marginTop: '3rem' }}>
      <h2 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Volunteering</h2>
      <article style={{ margin: '1.5rem 0' }}>
        <h3>[Volunteer Role] @ [Organization]</h3>
        <p><em>[Date Range]</em></p>
        <p>A brief overview of your contribution and the impact on the organization or community.</p>
      </article>
    </div>
  </section>
);

export default Experience;
