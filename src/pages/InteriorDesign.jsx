import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { pageVariants, buttonTapVariants } from '../utils/motionVariants';
import '../styles/pages.css';

const STEPS = [
  {
    number: '01',
    title: 'Consultation',
    description: 'We start with a free 30-minute call to understand your space, budget, lifestyle, and aesthetic. No obligations — just clarity.',
    icon: '💬',
  },
  {
    number: '02',
    title: 'Curation',
    description: 'Our designers handpick pieces from our catalog to create a cohesive look for your room. You receive a mood board and a full shopping list.',
    icon: '🎨',
  },
  {
    number: '03',
    title: 'Installation',
    description: 'We coordinate delivery and professional installation. Your space is transformed — ready to live in from day one.',
    icon: '🏠',
  },
];

const GALLERY = [
  { url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80', label: 'Living Rooms' },
  { url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80', label: 'Lighting Design' },
  { url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=600&q=80', label: 'Dining Spaces' },
  { url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=600&q=80', label: 'Bedrooms' },
];

export default function InteriorDesign() {
  const navigate = useNavigate();
  const [hoveredGallery, setHoveredGallery] = useState(null);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
      style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem 6rem' }}
    >
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <p style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: 600, marginBottom: '1rem' }}>
          Professional Interior Design
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', letterSpacing: '-0.05em', color: 'var(--color-on-surface)', margin: '0 0 1.5rem' }}>
          Design Services
        </h1>
        <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '1.1rem', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
          Transform your space with the help of our in-house design team. From a single room to a full home — we handle everything.
        </p>
      </div>

      {/* Gallery */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '6rem' }}>
        {GALLERY.map((item, i) => (
          <motion.div
            key={i}
            onHoverStart={() => setHoveredGallery(i)}
            onHoverEnd={() => setHoveredGallery(null)}
            style={{ borderRadius: '14px', overflow: 'hidden', aspectRatio: '3/4', position: 'relative', cursor: 'pointer' }}
          >
            <motion.img
              loading="lazy"
              src={item.url} alt={item.label}
              animate={{ scale: hoveredGallery === i ? 1.07 : 1 }}
              transition={{ duration: 0.4 }}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)' }} />
            <p style={{ position: 'absolute', bottom: '1rem', left: '1rem', color: '#fff', fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>
              {item.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* 3-Step Process */}
      <div style={{ marginBottom: '6rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.04em', color: 'var(--color-on-surface)', margin: '0 0 0.75rem' }}>
            How It Works
          </h2>
          <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '1rem' }}>
            Three simple steps to your dream space.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              style={{
                padding: '2rem',
                border: '1px solid var(--color-outline-variant)',
                borderRadius: '20px',
                background: 'var(--color-surface-container-lowest)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Step number watermark */}
              <div style={{ position: 'absolute', top: '1rem', right: '1.25rem', fontSize: '4rem', fontWeight: 900, color: 'var(--color-primary)', opacity: 0.06, lineHeight: 1, pointerEvents: 'none' }}>
                {step.number}
              </div>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{step.icon}</div>
              <p style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: 700, marginBottom: '0.5rem' }}>
                Step {step.number}
              </p>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', letterSpacing: '-0.03em', color: 'var(--color-on-surface)', margin: '0 0 0.75rem' }}>
                {step.title}
              </h3>
              <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.95rem', lineHeight: 1.65, margin: 0 }}>
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Contact CTA */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: 'var(--color-primary)',
          borderRadius: '24px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle grid overlay */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#fff', letterSpacing: '-0.04em', margin: '0 0 1rem' }}>
            Ready to transform your space?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', marginBottom: '2rem', maxWidth: '440px', margin: '0 auto 2rem' }}>
            Book a free consultation with our design team. No commitment required.
          </p>
          <motion.button
            variants={buttonTapVariants} whileHover="hover" whileTap="tap"
            onClick={() => window.open('mailto:design@curatedspace.com', '_blank')}
            style={{
              background: '#fff',
              color: 'var(--color-primary)',
              border: 'none',
              padding: '1rem 2.5rem',
              borderRadius: '999px',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Contact Our Designers
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
