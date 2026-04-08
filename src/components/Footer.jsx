import React from 'react';
import '../styles/layout.css';
import { API_BASE_URL } from '../api/apiClient';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-info">
        <h3>CuratedStore</h3>
        <p>Premium Furniture & Home Decor</p>
      </div>
      <div className="site-navigation">
        <a href="#" className="nav-link">Support</a>
        <a href="#" className="nav-link">Privacy Info</a>
      </div>

      {import.meta.env?.DEV && (
        <div style={{ 
          marginTop: '2rem', padding: '0.5rem 1rem', display: 'inline-block',
          background: API_BASE_URL === '/api' ? '#f59e0b20' : '#10b98120',
          color: API_BASE_URL === '/api' ? '#d97706' : '#059669',
          border: `1px solid ${API_BASE_URL === '/api' ? '#f59e0b' : '#10b981'}`,
          borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase'
        }}>
          Deployment: {API_BASE_URL === '/api' ? 'Localhost Proxy' : 'Production Render'}
        </div>
      )}
    </footer>
  );
}
