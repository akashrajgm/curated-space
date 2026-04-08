import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function ArchitecturalImage({ src, alt, className, style }) {
  const [isLoaded, setIsLoaded] = useState(false);

  const FALLBACK = 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800';

  let lowResSrc = src;
  let highResSrc = src;

  if (src && src.includes('unsplash.com')) {
    const baseUrl = src.split('?')[0];
    lowResSrc = `${baseUrl}?auto=format&fit=crop&q=10&w=50&blur=100`;
    highResSrc = `${baseUrl}?auto=format&fit=crop&q=80&w=800`;
  }

  return (
    <div className={className} style={{ position: 'relative', overflow: 'hidden', backgroundColor: 'var(--color-surface-dim)', ...style }}>
       {/* Blurred low-res placeholder shown while high-res loads */}
       <img
         src={lowResSrc}
         alt=""
         aria-hidden="true"
         loading="lazy"
         style={{
           width: '100%', height: '100%', objectFit: 'cover',
           filter: 'blur(20px)',
           transform: 'scale(1.1)',
           position: 'absolute', inset: 0,
           zIndex: 0
         }}
       />

       {/* High-res image with direct onError fallback — no state flicker */}
       <motion.img
          loading="lazy"
          src={highResSrc}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK; setIsLoaded(true); }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            position: 'relative', zIndex: 1
          }}
       />
    </div>
  );
}
