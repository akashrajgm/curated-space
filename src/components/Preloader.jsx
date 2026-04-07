import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Preloader({ onComplete }) {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    // A sophisticated cinematic loader that advances with dynamic variance
    const timer = setInterval(() => {
      setCounter(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 600); // 600ms pregnant pause at 100%
          return 100;
        }
        return prev + Math.floor(Math.random() * 8) + 1;
      });
    }, 45);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999999,
        background: 'var(--color-surface-container-lowest)',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: '0 2rem'
      }}
    >
      <div style={{ overflow: 'hidden', paddingBottom: '0.5rem' }}>
         <motion.h1
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', margin: 0, color: 'var(--color-on-surface)', letterSpacing: '-2px' }}
         >
           Curating Sequence
         </motion.h1>
      </div>
      
      <motion.div 
         initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
         style={{ marginTop: '3rem', width: '100%', maxWidth: '300px', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}
      >
         <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '1rem', color: 'var(--color-on-surface-variant)' }}>
            <span>Constructing Space</span>
            <span>{Math.min(counter, 100)}%</span>
         </div>
         <div style={{ width: '100%', height: '2px', background: 'var(--color-surface-variant)', position: 'relative', overflow: 'hidden' }}>
            <motion.div 
               style={{ position: 'absolute', top: 0, bottom: 0, left: 0, background: 'var(--color-primary)', width: `${counter}%` }}
               transition={{ duration: 0.1 }}
            />
         </div>
      </motion.div>
    </motion.div>
  );
}
