import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <a href="#main-content" className="sr-only">Skip to main content</a>
      <Navbar />
      <main id="main-content" style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1.5rem', width: '100%' }}>
        {children}
      </main>
      <footer style={{ textAlign: 'center', padding: '3rem 0', borderTop: '1px solid var(--border-color)', marginTop: 'auto' }}>
        <p>&copy; 2026 Sabari Vijayan. All rights reserved.</p>
      </footer>
    </>
  );
};

export default Layout;
