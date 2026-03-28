import React from 'react';
import { Link } from 'react-router-dom';

const About: React.FC = () => (
  <section className="about-container">
    <div className="about-content">
      <div className="about-image-wrapper">
        <img 
          src="/profile-long.png" 
          alt="Professional portrait of Sabari Vijayan" 
          className="profile-image"
        />
      </div>
      <div className="about-text">
        <h1 className="hero-title">Hi, I'm Sabari Vijayan.</h1>
        <p className="lead-text">
          A <strong>Computer Science student at RIT Kottayam</strong> (2023–2027) 
          passionate about building resilient, human-centric software.
        </p>
        
        <p>
          I approach development with an architect’s mindset: 
          <em> Code should be as readable as it is functional.</em> My process is built 
          on the foundations of <strong>Accessibility (WCAG)</strong>, 
          <strong>Performance</strong>, and <strong>Modular System Design</strong>.
        </p>

        <p>
          Based in <strong>Pathanamthitta, Kerala, India</strong>, I am constantly 
          exploring how clean architecture and modern web technologies can be 
          leveraged to solve real-world problems effectively.
        </p>

        <div className="cta-group">
          <Link to="/portfolio" className="btn-primary" aria-label="View my portfolio projects">View My Work</Link>
          <Link to="/contact" className="btn-secondary" aria-label="Contact me for collaborations">Let's Connect</Link>
        </div>
      </div>
    </div>

    <style>{`
      .about-container { padding: 1rem 0; }
      .about-content { display: flex; gap: 4rem; align-items: flex-start; flex-wrap: wrap; }
      .about-image-wrapper { flex: 0 0 280px; max-width: 100%; }
      
      .profile-image { 
        width: 100%; 
        height: auto; 
        border: 1px solid var(--border-color); 
        box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); 
        display: block; 
      }
      
      .about-text { flex: 1; min-width: 320px; }
      
      .hero-title { 
        font-size: 3rem; 
        font-weight: 800; 
        letter-spacing: -0.02em; 
        margin-bottom: 1.5rem; 
        color: var(--accent-color); 
      }
      
      .lead-text { 
        font-size: 1.25rem; 
        line-height: 1.6; 
        color: var(--text-color); 
        margin-bottom: 1.5rem; 
        opacity: 0.9; 
      }
      
      .cta-group { display: flex; gap: 1rem; margin-top: 2.5rem; }
      
      .btn-primary, .btn-secondary {
        padding: 0.75rem 1.5rem;
        border-radius: 6px;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.2s ease;
        display: inline-block;
        text-align: center;
      }

      .btn-primary { 
        background-color: var(--accent-color); 
        color: #ffffff; 
        border: 1px solid var(--accent-color); 
      }
      
      .btn-primary:hover, .btn-primary:focus { 
        transform: translateY(-2px); 
        box-shadow: 0 4px 12px rgba(67, 56, 202, 0.3); 
        outline: 3px solid var(--accent-color); 
        outline-offset: 4px; 
      }
      
      .btn-secondary { 
        background-color: transparent; 
        color: var(--text-color); 
        border: 1px solid var(--border-color); 
      }
      
      .btn-secondary:hover, .btn-secondary:focus { 
        background-color: var(--nav-bg); 
        border-color: var(--accent-color); 
        transform: translateY(-2px); 
        outline: 3px solid var(--accent-color); 
        outline-offset: 4px; 
      }

      @media (max-width: 768px) {
        .about-content { flex-direction: column; text-align: center; gap: 2.5rem; }
        .about-image-wrapper { margin: 0 auto; width: 220px; }
        .hero-title { font-size: 2.5rem; }
        .cta-group { justify-content: center; }
      }
    `}</style>
  </section>
);

export default About;
