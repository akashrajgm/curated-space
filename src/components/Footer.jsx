import React from 'react';
import '../styles/layout.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-info">
        <h3>CuratedStore</h3>
        <p>Premium Architectural E-Commerce Platform</p>
      </div>
      <div className="site-navigation">
        <a href="#" className="nav-link">Support</a>
        <a href="#" className="nav-link">Privacy Info</a>
      </div>
    </footer>
  );
}
