import React from 'react';

const Blog: React.FC = () => (
  <section>
    <h1>Blog</h1>
    <p style={{ marginBottom: '2rem' }}>Sharing my thoughts on technology, design, and my learning journey.</p>
    
    <div className="blog-posts">
      <article style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem', marginBottom: '2rem' }}>
        <h2>[Blog Post Title]</h2>
        <p><em>October 20, 2026</em></p>
        <p>A short intro or summary of what this blog post is about. It could be a tutorial, a project retrospective, or an opinion piece.</p>
        <a href="#">Read More &rarr;</a>
      </article>

      <article style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem', marginBottom: '2rem' }}>
        <h2>[Another Interesting Topic]</h2>
        <p><em>September 15, 2026</em></p>
        <p>Another snippet of your writing to engage readers and show your expertise.</p>
        <a href="#">Read More &rarr;</a>
      </article>
    </div>
  </section>
);

export default Blog;
