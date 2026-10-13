import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const navLinks = [
    { to: '/', label: 'About' },
    { to: '/experience', label: 'Experience' },
    { to: '/portfolio', label: 'Portfolio' },
    { to: '/blog', label: 'Blog' },
    { to: '/documents', label: 'Documents' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header className="navbar-container">
      <nav className="navbar" aria-label="Main Navigation">
        <div className="navbar-logo">
          <NavLink to="/" onClick={() => setIsOpen(false)} aria-label="Home">Portfolio</NavLink>
        </div>

        <div className="navbar-actions">
          <button onClick={toggleTheme} className="theme-toggle" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button className={`hamburger-btn ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen} aria-controls="site-menu" aria-label="Toggle menu">
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
      </nav>

      <div className={`menu-overlay ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(false)}>
        <ul id="site-menu" className={`menu-links ${isOpen ? 'open' : ''}`} onClick={e => e.stopPropagation()} aria-hidden={!isOpen}>
          {navLinks.map((link, i) => (
            <li key={link.to} style={{ ['--i' as string]: i } as React.CSSProperties}>
              <NavLink to={link.to} onClick={() => setIsOpen(false)} tabIndex={isOpen ? 0 : -1} className={({ isActive }) => isActive ? 'active-link' : ''}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        .navbar-container { background-color: var(--nav-bg); border-bottom: 1px solid var(--border-color); position: sticky; top: 0; z-index: 1000; padding: 0.5rem 0; }
        .navbar { max-width: 1000px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 0 1.5rem; height: 3.5rem; }
        .navbar-logo a { font-weight: 700; font-size: 1.25rem; color: var(--text-color); }
        .active-link { color: var(--accent-color) !important; border-bottom: 2px solid var(--accent-color); }
        .navbar-actions { display: flex; align-items: center; gap: 1rem; }
        .theme-toggle { 
          background: none; 
          border: 1px solid var(--border-color); 
          color: var(--text-color); 
          padding: 0.5rem; 
          border-radius: 4px; 
          cursor: pointer; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          transition: background-color 0.3s ease, border-color 0.3s ease;
          overflow: hidden;
        }
        .theme-toggle:hover {
          background-color: var(--border-color);
        }
        .theme-toggle:focus-visible, .hamburger-btn:focus-visible, .menu-links a:focus-visible {
          outline: 2px solid var(--accent-color);
          outline-offset: 3px;
          border-radius: 4px;
        }
        .theme-toggle svg {
          animation: icon-spin 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes icon-spin {
          from { transform: rotate(-90deg) scale(0); opacity: 0; }
          to { transform: rotate(0) scale(1); opacity: 1; }
        }
        /* Hamburger visible on all viewports (desktop experiment) */
        .hamburger-btn { display: flex; flex-direction: column; justify-content: space-around; width: 2rem; height: 2rem; background: transparent; border: none; cursor: pointer; padding: 0; z-index: 1010; }
        .hamburger-line { width: 2rem; height: 0.2rem; background: var(--text-color); border-radius: 10px; transition: all 0.3s linear; position: relative; transform-origin: 1px; }
        .hamburger-btn.open .hamburger-line:first-child { transform: rotate(45deg); }
        .hamburger-btn.open .hamburger-line:nth-child(2) { opacity: 0; transform: translateX(20px); }
        .hamburger-btn.open .hamburger-line:nth-child(3) { transform: rotate(-45deg); }
        /* Shared drawer for mobile + desktop */
        .menu-overlay { position: fixed; top: 4.5rem; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); opacity: 0; visibility: hidden; transition: opacity 0.3s ease, visibility 0.3s ease; display: flex; justify-content: flex-end; z-index: 999; }
        .menu-overlay.open { opacity: 1; visibility: visible; }
        .menu-links { background: var(--bg-color); width: min(340px, 85vw); height: 100%; list-style: none; padding: 2rem 2rem 3rem; display: flex; flex-direction: column; gap: 0.25rem; transform: translateX(100%); transition: transform 0.38s cubic-bezier(0.32, 0.72, 0, 1); box-shadow: -2px 0 10px rgba(0,0,0,0.1); overflow-y: auto; }
        .menu-links.open { transform: translateX(0); }
        .menu-links li { opacity: 0; transform: translateX(16px); transition: opacity 0.28s ease, transform 0.32s ease; }
        .menu-links.open li { opacity: 1; transform: translateX(0); transition-delay: calc(0.08s + var(--i) * 0.05s); }
        .menu-links a { color: var(--text-color); font-size: 1.25rem; font-weight: 500; display: block; padding: 0.7rem 0.25rem; border-bottom: 1px solid var(--border-color); transition: color 0.2s ease, padding-left 0.25s ease; }
        .menu-links a:hover { color: var(--accent-color); padding-left: 0.5rem; }
        @media (prefers-reduced-motion: reduce) {
          .menu-overlay, .menu-links, .menu-links li, .menu-links a, .hamburger-line { transition: none; }
          .menu-links li { opacity: 1; transform: none; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
