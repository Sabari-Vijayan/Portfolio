import React from 'react';
import { Mail, Phone, ExternalLink } from 'lucide-react';

const Contact: React.FC = () => (
  <section>
    <h1>Contact Me</h1>
    <p style={{ fontSize: '1.1rem', marginBottom: '2.5rem' }}>
      I'm always open to discussing new projects, creative ideas, or opportunities 
      to be part of your vision. Feel free to reach out!
    </p>
    
    <div className="contact-info">
      <div className="contact-method" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Mail size={24} color="var(--accent-color)" aria-hidden="true" />
        <div>
          <h3 style={{ margin: 0, fontSize: '1rem', opacity: 0.7 }}>Email</h3>
          <a href="mailto:vijayansabari06@gmail.com" style={{ fontSize: '1.2rem' }}>vijayansabari06@gmail.com</a>
        </div>
      </div>

      <div className="contact-method" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Phone size={24} color="var(--accent-color)" aria-hidden="true" />
        <div>
          <h3 style={{ margin: 0, fontSize: '1rem', opacity: 0.7 }}>Phone</h3>
          <a href="tel:+918590483660" style={{ fontSize: '1.2rem' }}>+91 8590483660</a>
        </div>
      </div>

      <div className="contact-method" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <ExternalLink size={24} color="var(--accent-color)" aria-hidden="true" />
        <div>
          <h3 style={{ margin: 0, fontSize: '1rem', opacity: 0.7 }}>Links</h3>
          <a href="https://linktr.ee/sabarivijayan" target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.2rem' }}>linktr.ee/sabarivijayan</a>
        </div>
      </div>

      <div className="location-info" style={{ marginTop: '3rem', padding: '1.5rem', background: 'var(--nav-bg)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <h3 style={{ marginBottom: '0.5rem' }}>Location</h3>
        <p style={{ margin: 0 }}>Pathanamthitta, Kerala, India</p>
      </div>
    </div>
  </section>
);

export default Contact;
