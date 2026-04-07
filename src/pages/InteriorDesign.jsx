import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { pageVariants, buttonTapVariants } from '../utils/motionVariants';
import '../styles/pages.css';

const galleries = [
  { url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600", category: "Sofas" },
  { url: "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&w=600", category: "Lighting" },
  { url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=600", category: "Chairs" },
  { url: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600", category: "Interior Decor" }
];

export default function InteriorDesign() {
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <motion.div className="interior-page" variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ padding: '2rem 0' }}>
      <header style={{ marginBottom: '4rem', textAlign: 'center' }}>
         <h1 className="page-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Curated Interiors</h1>
         <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '1.25rem' }}>Discover context explicitly mapped to high-end architectural space.</p>
      </header>
      
      {/* Fallback clean columns matching masonry */}
      <div style={{ columnCount: window.innerWidth < 768 ? 1 : 2, columnGap: '3rem' }}>
         {galleries.map((item, i) => (
            <motion.div 
               key={i} 
               style={{ position: 'relative', marginBottom: '3rem', borderRadius: 'var(--radius-xl)', overflow: 'hidden', cursor: 'crosshair', display: 'inline-block', width: '100%' }}
               onHoverStart={() => setHoveredIndex(i)}
               onHoverEnd={() => setHoveredIndex(null)}
               layout
            >
               <img src={item.url} alt={`Interior Mapping ${i}`} style={{ width: '100%', display: 'block', pointerEvents: 'none' }} />
               
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: hoveredIndex === i ? 1 : 0 }}
                 transition={{ duration: 0.2 }}
                 style={{
                    position: 'absolute', inset: 0, background: 'rgba(25, 27, 35, 0.25)', backdropFilter: 'blur(1px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                 }}
               >
                  <motion.button 
                    variants={buttonTapVariants} whileHover="hover" whileTap="tap"
                    style={{ background: 'var(--color-surface-container-lowest)', color: 'var(--color-primary)', border: 'none', padding: '0.8rem 1.75rem', borderRadius: 'var(--radius-xl)', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                    onClick={() => navigate(`/?category=${item.category}`)}
                  >
                     Shop This Look
                  </motion.button>
               </motion.div>
            </motion.div>
         ))}
      </div>
    </motion.div>
  );
}
