import React from 'react';
import Header from './Header';
import Footer from './Footer';
import '../styles/layout.css';

export default function Layout({ children }) {
  return (
    <div className="app-layout" style={{ 
      paddingBottom: '5rem', /* Safari safe area constraint equivalent pb-20 */
      paddingLeft: 'var(--container-padding, 1rem)', 
      paddingRight: 'var(--container-padding, 1rem)' 
    }}>
      <Header />
      <main className="main-content" style={{ width: '100%', maxWidth: '1440px', margin: '0 auto' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
