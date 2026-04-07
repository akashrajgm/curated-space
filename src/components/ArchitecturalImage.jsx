import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function ArchitecturalImage({ src, alt, className, style }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  let lowResSrc = src;
  let highResSrc = src;

  if (src && src.includes('unsplash.com')) {
    const baseUrl = src.split('?')[0];
    lowResSrc = `${baseUrl}?auto=format&fit=crop&q=10&w=50&blur=100`;
    highResSrc = `${baseUrl}?auto=format&fit=crop&q=80&w=800`;
  }

  return (
    <div className={className} style={{ position: 'relative', overflow: 'hidden', backgroundColor: 'var(--color-surface-dim)', ...style }}>
       {!hasError && (
         <img 
            src={lowResSrc} 
            alt={`Placeholder ${alt}`} 
            style={{ 
               width: '100%', height: '100%', objectFit: 'cover', 
               filter: 'blur(20px)', 
               transform: 'scale(1.1)', 
               position: 'absolute', inset: 0,
               zIndex: 0
            }} 
         />
       )}
       
       {!hasError ? (
         <motion.img 
            src={highResSrc} 
            alt={alt}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{ 
               width: '100%', height: '100%', objectFit: 'cover', 
               position: 'relative', zIndex: 1 
            }}
         />
       ) : (
         <div style={{ width: '100%', height: '100%', backgroundColor: '#e5e7eb', position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#9ca3af', fontFamily: 'var(--font-body)', letterSpacing: '1px' }}>ASSET UNAVAILABLE</span>
         </div>
       )}
    </div>
  );
}
