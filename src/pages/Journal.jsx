import React from 'react';
import { motion } from 'framer-motion';
import { pageVariants, cardHoverVariants } from '../utils/motionVariants';

const articles = [
  { title: "The Art of Minimalist Lighting", desc: "Illumination serving dual purposes as an isolated architectural anchor and a contextual map navigating shadows across negative space constraints.", img: "https://images.unsplash.com/photo-1513506003901-1e6a229e9d15?auto=format&fit=crop&w=800" },
  { title: "Concrete Elements in Soft Architecture", desc: "Balancing rough brutalist structures with tailored interior linens to prevent the living area from feeling sterile while securing profound geometry.", img: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=800" },
  { title: "Sustaining Form Through Oak", desc: "Bridging the visual temperature gap using natural wood grain structures aligned rigidly against strict white parameters.", img: "https://images.unsplash.com/photo-1585257917822-4a00473ce17f?auto=format&fit=crop&w=800" }
];

export default function Journal() {
  return (
    <motion.div className="journal-page" variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ padding: '2rem 0', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '5rem', textAlign: 'center' }}>
         <h1 className="page-title" style={{ fontSize: '3rem' }}>Editorial Volumes</h1>
      </header>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
         {articles.map((art, i) => (
           <motion.div 
              key={i} 
              variants={cardHoverVariants} whileHover="hover" 
              initial={{ opacity: 0, y: 80 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true, margin: "-100px" }} 
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.76, 0, 0.24, 1] }} 
              style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1.2fr 1fr', gap: '4rem', alignItems: 'center', cursor: 'pointer', background: 'transparent' }}
           >
              <div style={{ width: '100%', aspectRatio: '16/10', borderRadius: 'var(--radius-xl)', overflow: 'hidden', backgroundImage: `url(${art.img})`, backgroundSize: 'cover', backgroundPosition: 'center', boxShadow: '0 30px 60px rgba(0,0,0,0.05)' }}></div>
              <div>
                 <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: '1.25rem', lineHeight: 1.1, color: 'var(--color-on-surface)' }}>{art.title}</h2>
                 <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.15rem', color: 'var(--color-on-surface-variant)', lineHeight: 1.7 }}>{art.desc}</p>
                 <button className="ghost-button" style={{ marginTop: '2.5rem', borderBottom: '2px solid var(--color-primary)', padding: '0 0 0.25rem 0', borderRadius: 0, fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-primary)' }}>Read Construct &rarr;</button>
              </div>
           </motion.div>
         ))}
      </div>
    </motion.div>
  );
}
