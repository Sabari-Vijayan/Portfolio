import React from 'react';
import { blogList } from '../data/blogs';

const Blog: React.FC = () => (
  <section className="blog-container">
    <div className="header-meta">
      <span>SABARI VIJAYAN</span>
      <span>TECHNICAL NOTES AND REVIEWS</span>
    </div>

    <div className="main-grid">
      <aside className="sidebar">
        <h2 className="section-label">LOG ENTRIES</h2>
        <div className="archive-stats">
          <p>TOTAL POSTS: {blogList.length.toString().padStart(2, '0')}</p>
          <p>PLATFORM: MEDIUM</p>
        </div>
      </aside>

      <main className="content">
        <div className="section-intro">
          <h1>Journal</h1>
          <p>Sharing technical retrospectives, design philosophies, and architectural notes from my journey as a developer.</p>
        </div>

        <div className="post-list">
          {blogList.length > 0 ? (
            blogList.map((post, idx) => (
              <article key={idx} className="post-row">
                <div className="post-meta">
                  <span className="post-date">[{new Date(post.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()}]</span>
                </div>
                <div className="post-main">
                  <h3>{post.title}</h3>
                  <p>{post.summary}</p>
                  <a href={post.link} className="text-link" target="_blank" rel="noopener noreferrer">→ READ ARTICLE</a>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state" style={{ padding: '2rem 0', opacity: 0.5, fontStyle: 'italic' }}>
              <p>No entries found. Journaling will commence shortly.</p>
            </div>
          )}
        </div>
      </main>
    </div>

    <style>{`
      .blog-container { padding: 1rem 0; font-family: 'Newsreader', 'Georgia', 'Times New Roman', serif; }
      
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

      .archive-stats {
        font-family: inherit;
        font-size: 0.75rem;
        opacity: 0.6;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        letter-spacing: 0.02em;
      }

      .content { display: flex; flex-direction: column; gap: 4rem; }
      .section-intro h1 { font-size: 2.5rem; margin-bottom: 1rem; letter-spacing: -0.02em; }
      .section-intro p { font-size: 1.1rem; line-height: 1.6; opacity: 0.8; max-width: 600px; }

      .post-list { display: flex; flex-direction: column; }
      .post-row {
        display: grid;
        grid-template-columns: 140px 1fr;
        gap: 2rem;
        padding: 2rem 0;
        border-bottom: 1px solid var(--border-color);
      }
      .post-row:first-child { padding-top: 0; }
      
      .post-meta {
        font-family: inherit;
        font-size: 0.75rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        opacity: 0.6;
        padding-top: 0.5rem;
        letter-spacing: 0.02em;
      }

      .post-main h3 { font-size: 1.25rem; margin-bottom: 0.5rem; font-weight: 700; }
      .post-main p { font-size: 1rem; opacity: 0.8; margin-bottom: 1rem; line-height: 1.5; }

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
        .sidebar { order: -1; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; }
        .section-label { margin-bottom: 0; }
        .archive-stats { flex-direction: row; gap: 2rem; }
        .post-row { grid-template-columns: 1fr; gap: 1rem; }
        .post-meta { flex-direction: row; gap: 1rem; padding-top: 0; }
        .header-meta { font-size: 0.65rem; }
        .section-intro h1 { font-size: 2rem; }
      }
    `}</style>
  </section>
);

export default Blog;
