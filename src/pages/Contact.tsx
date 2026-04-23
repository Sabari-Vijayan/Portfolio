import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

const Contact: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.current) return;

    setIsSending(true);
    setStatus('idle');

    emailjs.sendForm(
      import.meta.env.VITE_EMAIL_SERVICE_ID || '', 
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '', 
      form.current, 
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''
    )
      .then(() => {
        setStatus('success');
        form.current?.reset();
      })
      .catch((error) => {
        console.error('EmailJS Error:', error);
        setStatus('error');
      })
      .finally(() => {
        setIsSending(false);
      });
  };

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

          <div className="contact-list-sidebar">
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
        </aside>

        <main className="content">
          <div className="section-intro">
            <h1>Contact</h1>
            <p>Whether you have a question, a project idea, or just want to talk about product nuances and architectural precision—I'm always open to a conversation.</p>
          </div>

          <div className="contact-form-wrapper">
            <form ref={form} onSubmit={sendEmail} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="user_name">NAME</label>
                  <input type="text" name="name" id="user_name" required placeholder="Your name" />
                </div>
                <div className="form-group">
                  <label htmlFor="user_email">EMAIL</label>
                  <input type="email" name="user_email" id="user_email" required placeholder="your.email@example.com" />
                </div>

              </div>
              <div className="form-group">
                <label htmlFor="message">MESSAGE</label>
                <textarea name="title" id="message" required rows={6} placeholder="What's on your mind?"></textarea>
              </div>
              <button type="submit" disabled={isSending} className="submit-btn">
                {isSending ? 'SENDING...' : 'SEND MESSAGE'}
              </button>
              
              {status === 'success' && <p className="status-msg success">Message sent successfully. I will get back to you soon.</p>}
              {status === 'error' && <p className="status-msg error">Failed to send message. Please try again or use direct email.</p>}
            </form>
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
          grid-template-columns: 280px 1fr;
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

        .content { display: flex; flex-direction: column; gap: 3rem; }
        .section-intro h1 { font-size: 2.5rem; margin-bottom: 1rem; letter-spacing: -0.02em; }
        .section-intro p { font-size: 1.1rem; line-height: 1.6; opacity: 0.8; max-width: 600px; }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-group label {
          font-size: 0.75rem;
          font-weight: 700;
          opacity: 0.6;
          letter-spacing: 0.05em;
        }
        .form-group input, .form-group textarea {
          padding: 1rem;
          background: var(--nav-bg);
          border: 1px solid var(--border-color);
          color: var(--text-color);
          font-family: inherit;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.2s;
          border-radius: 4px;
        }
        .form-group input:focus, .form-group textarea:focus {
          border-color: var(--accent-color);
        }
        .submit-btn {
          padding: 1rem;
          background: var(--accent-color);
          color: var(--bg-color);
          border: none;
          font-weight: 700;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: opacity 0.2s;
          border-radius: 4px;
        }
        .submit-btn:hover {
          opacity: 0.9;
        }
        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .status-msg {
          font-size: 0.9rem;
          margin-top: 0.5rem;
        }
        .status-msg.success { color: #2e7d32; }
        .status-msg.error { color: #d32f2f; }

        .contact-list-sidebar { margin-top: 3rem; border-top: 1px solid var(--border-color); padding-top: 2rem; }
        .contact-table { width: 100%; border-collapse: collapse; }
        .contact-table tr { border-bottom: 1px solid var(--border-color); }
        .contact-table tr:last-child { border-bottom: none; }
        .row-label {
          padding: 0.75rem 0;
          font-family: inherit;
          font-size: 0.7rem;
          width: 80px;
          opacity: 0.5;
          vertical-align: middle;
          font-weight: 600;
        }
        .row-data { padding: 0.75rem 0; font-weight: 500; font-size: 0.9rem; }

        .text-link {
          color: var(--text-color);
          text-decoration: none;
          transition: color 0.2s;
        }
        .text-link:hover {
          color: var(--accent-color);
        }

        @media (max-width: 850px) {
          .main-grid { grid-template-columns: 1fr; gap: 3rem; }
          .sidebar { order: 2; border-top: 1px solid var(--border-color); padding-top: 3rem; display: block; }
          .form-row { grid-template-columns: 1fr; }
          .row-label { width: 100px; }
          .section-intro h1 { font-size: 2rem; }
        }
      `}</style>
    </section>
  );
};

export default Contact;
