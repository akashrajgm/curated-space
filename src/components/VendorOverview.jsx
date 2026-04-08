import React from 'react';
import { motion } from 'framer-motion';

export default function VendorOverview() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 style={{fontSize: '2.5rem', marginBottom: '2rem', fontFamily: 'var(--font-display)', letterSpacing: '-1px'}}>Studio Operations</h1>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem'}}>
        
        <div style={{padding: '2rem', background: 'var(--color-surface-container-lowest)', border: '1px solid var(--color-primary)', borderRadius: 'var(--radius-xl)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)'}}>
          <h3 style={{fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-on-surface-variant)', marginBottom: '1rem'}}>Global Sales</h3>
          <p style={{fontSize: '3rem', fontWeight: 700, color: 'var(--color-primary)', margin: 0, lineHeight: 1}}>$124.5k</p>
        </div>
        
        <div style={{padding: '2rem', background: 'var(--color-surface-container-lowest)', border: '1px solid var(--color-outline-variant)', borderRadius: 'var(--radius-xl)'}}>
          <h3 style={{fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-on-surface-variant)', marginBottom: '1rem'}}>Active Listings</h3>
          <p style={{fontSize: '3rem', fontWeight: 700, margin: 0, lineHeight: 1}}>42</p>
        </div>
        
        <div style={{padding: '2rem', background: 'var(--color-surface-container-lowest)', border: '1px solid var(--color-outline-variant)', borderRadius: 'var(--radius-xl)'}}>
          <h3 style={{fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-on-surface-variant)', marginBottom: '1rem'}}>Market Views</h3>
          <p style={{fontSize: '3rem', fontWeight: 700, margin: 0, lineHeight: 1}}>8.2k</p>
        </div>

      </div>
    </motion.div>
  );
}
