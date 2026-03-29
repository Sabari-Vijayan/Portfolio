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

        <ul className="desktop-links">
          {navLinks.map(link => (
            <li key={link.to}>
              <NavLink to={link.to} className={({ isActive }) => isActive ? 'active-link' : ''}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="navbar-actions">
          <button onClick={toggleTheme} className="theme-toggle" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button className={`hamburger-btn ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen} aria-label="Toggle mobile menu">
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
      </nav>

      <div className={`mobile-menu-overlay ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(false)}>
        <ul className={`mobile-links ${isOpen ? 'open' : ''}`} onClick={e => e.stopPropagation()}>
          {navLinks.map(link => (
            <li key={link.to}>
              <NavLink to={link.to} onClick={() => setIsOpen(false)} className={({ isActive }) => isActive ? 'active-link' : ''}>
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
        .desktop-links { display: flex; list-style: none; gap: 1.5rem; }
        .active-link { color: var(--accent-color) !important; border-bottom: 2px solid var(--accent-color); }
        .desktop-links a { color: var(--text-color); font-weight: 500; padding-bottom: 0.25rem; }
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
        .theme-toggle svg {
          animation: icon-spin 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes icon-spin {
          from { transform: rotate(-90deg) scale(0); opacity: 0; }
          to { transform: rotate(0) scale(1); opacity: 1; }
        }
        .hamburger-btn { display: none; flex-direction: column; justify-content: space-around; width: 2rem; height: 2rem; background: transparent; border: none; cursor: pointer; padding: 0; z-index: 1010; }
        .hamburger-line { width: 2rem; height: 0.2rem; background: var(--text-color); border-radius: 10px; transition: all 0.3s linear; position: relative; transform-origin: 1px; }
        .hamburger-btn.open .hamburger-line:first-child { transform: rotate(45deg); }
        .hamburger-btn.open .hamburger-line:nth-child(2) { opacity: 0; transform: translateX(20px); }
        .hamburger-btn.open .hamburger-line:nth-child(3) { transform: rotate(-45deg); }
        .mobile-menu-overlay { position: fixed; top: 4.5rem; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); opacity: 0; visibility: hidden; transition: opacity 0.3s ease, visibility 0.3s ease; display: flex; justify-content: flex-end; z-index: 999; }
        .mobile-menu-overlay.open { opacity: 1; visibility: visible; }
        .mobile-links { background: var(--bg-color); width: 280px; height: 100%; list-style: none; padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; transform: translateX(100%); transition: transform 0.3s ease-in-out; box-shadow: -2px 0 10px rgba(0,0,0,0.1); }
        .mobile-links.open { transform: translateX(0); }
        .mobile-links a { color: var(--text-color); font-size: 1.1rem; font-weight: 500; display: block; }
        @media (max-width: 768px) { .desktop-links { display: none; } .hamburger-btn { display: flex; } }
      `}</style>
    </header>
  );
};

export default Navbar;
