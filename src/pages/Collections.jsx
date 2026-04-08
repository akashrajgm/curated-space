import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageVariants, buttonTapVariants } from '../utils/motionVariants';
import '../styles/pages.css';

const CATEGORIES = [
  {
    name: 'Sofas',
    tagline: 'Where comfort meets design',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    count: '24 pieces',
  },
  {
    name: 'Chairs',
    tagline: 'Statement seating for every space',
    image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=800&q=80',
    count: '18 pieces',
  },
  {
    name: 'Lighting',
    tagline: 'Set the mood, define the room',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    count: '31 pieces',
  },
  {
    name: 'Interior Decor',
    tagline: 'The finishing touches that transform',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    count: '42 pieces',
  },
];

export default function Collections() {
  const navigate = useNavigate();

  return (
    <motion.div
      variants={pageVariants} initial="initial" animate="animate" exit="exit"
      style={{ padding: '3rem 2rem 6rem', maxWidth: '1200px', margin: '0 auto' }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <p style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: 600, marginBottom: '1rem' }}>
          Browse by Category
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.04em', color: 'var(--color-on-surface)', margin: 0 }}>
          All Categories
        </h1>
        <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '1.1rem', marginTop: '1rem', maxWidth: '480px', margin: '1rem auto 0' }}>
          Explore our full range of curated furniture and decor, organized for easy browsing.
        </p>
      </div>

      {/* Category Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
        {CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => navigate(`/?category=${cat.name}`)}
            style={{
              position: 'relative',
              borderRadius: '20px',
              overflow: 'hidden',
              cursor: 'pointer',
              aspectRatio: '3/4',
              background: '#111',
            }}
            whileHover="hover"
          >
            {/* Image */}
            <motion.img
              src={cat.image}
              alt={cat.name}
              variants={{ hover: { scale: 1.06 } }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.85 }}
            />

            {/* Gradient overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%)'
            }} />

            {/* Text */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem' }}>
              <p style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '0.35rem' }}>
                {cat.count}
              </p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: '#fff', margin: '0 0 0.3rem', letterSpacing: '-0.02em' }}>
                {cat.name}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                {cat.tagline}
              </p>
            </div>

            {/* Arrow badge */}
            <motion.div
              variants={{ hover: { opacity: 1, x: 0 } }}
              initial={{ opacity: 0, x: -8 }}
              style={{
                position: 'absolute', top: '1rem', right: '1rem',
                background: '#fff', width: '36px', height: '36px',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem',
              }}
            >
              →
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
