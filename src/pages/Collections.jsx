import React from 'react';
import { motion } from 'framer-motion';
import { pageVariants } from '../utils/motionVariants';
import '../styles/pages.css';

export default function Collections() {
  return (
    <motion.div className="cart-page empty" variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <div className="cart-empty-state" style={{ padding: '10rem 2rem', backgroundColor: 'var(--color-surface-container-lowest)' }}>
          <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', color: 'var(--color-on-surface)' }}>The Collections</h2>
          <p style={{ fontSize: '1.25rem' }}>Architectural curation in progress. Content arriving securely soon.</p>
        </div>
    </motion.div>
  );
}
