import React from 'react';
import { motion } from 'framer-motion';
import { pageVariants, cardHoverVariants, buttonTapVariants } from '../utils/motionVariants';
import '../styles/pages.css';

const articles = [
  {
    title: 'How to Choose the Perfect Minimalist Lighting',
    desc: "Good lighting doesn't just illuminate a room — it defines it. Learn how to pick the right fixtures that work with your space's natural light, create mood without clutter, and make every corner feel intentional.",
    img: 'https://images.pexels.com/photos/1123262/pexels-photo-1123262.jpeg?auto=compress&cs=tinysrgb&w=1200',
    tag: 'Lighting',
    readTime: '4 min read',
  },
  {
    title: 'Making Concrete Elements Feel Cozy',
    desc: "Concrete has a reputation for being cold and industrial. But with the right textiles, wood accents, and lighting, it becomes one of the warmest materials in your home. Here's how to strike that balance.",
    img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1200',
    tag: 'Interior Design',
    readTime: '5 min read',
  },
  {
    title: 'Why Oak Furniture is a Lifetime Investment',
    desc: "Oak furniture doesn't go out of style — it gets better with age. We break down why solid oak is worth the upfront cost, how to care for it properly, and which pieces give you the best long-term value.",
    img: 'https://images.unsplash.com/photo-1540638349517-3abd5afc5847?auto=format&fit=crop&q=80&w=1200',
    tag: 'Materials',
    readTime: '6 min read',
  },
];

export default function Journal() {
  return (
    <motion.div
      className="journal-page"
      variants={pageVariants} initial="initial" animate="animate" exit="exit"
      style={{ padding: '3rem 2rem 6rem', maxWidth: '1100px', margin: '0 auto' }}
    >
      {/* Page header */}
      <header style={{ marginBottom: '5rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: 600, marginBottom: '1rem' }}>
          Our Blog
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 5vw, 4rem)', letterSpacing: '-0.05em', color: 'var(--color-on-surface)', margin: '0 0 1rem' }}>
          Design Stories
        </h1>
        <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '1.05rem', maxWidth: '460px', margin: '0 auto' }}>
          Tips, trends, and ideas to help you design a home you love.
        </p>
      </header>

      {/* Articles */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
        {articles.map((art, i) => (
          <motion.article
            key={i}
            variants={cardHoverVariants} whileHover="hover"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="blog-card"
            style={{
              cursor: 'pointer',
              '--grid-cols': i % 2 === 0 ? '1.3fr 1fr' : '1fr 1.3fr',
              '--image-order': i % 2 !== 0 ? 2 : 1,
              '--text-order': i % 2 !== 0 ? 1 : 2
            }}
          >
            {/* Image */}
            <div className="blog-card-image" style={{
              aspectRatio: '16/10',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.08)',
              order: 'var(--image-order)',
              minHeight: '280px',
              background: '#f1f5f9',
            }}>
              <img
                src={art.img}
                alt={art.title}
                loading={i === 0 ? 'eager' : 'lazy'}
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200'; }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: '280px' }}
              />
            </div>

            {/* Text content */}
            <div className="blog-card-text" style={{ order: 'var(--text-order)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                <span style={{
                  padding: '0.3rem 0.75rem',
                  background: 'rgba(99,102,241,0.08)',
                  color: 'var(--color-primary)',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}>
                  {art.tag}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-on-surface-variant)' }}>
                  {art.readTime}
                </span>
              </div>

              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)',
                letterSpacing: '-0.03em',
                color: 'var(--color-on-surface)',
                lineHeight: 1.2,
                margin: '0 0 1rem',
              }}>
                {art.title}
              </h2>

              <p style={{
                fontSize: '1rem',
                color: 'var(--color-on-surface-variant)',
                lineHeight: 1.75,
                margin: '0 0 2rem',
              }}>
                {art.desc}
              </p>

              <motion.button
                variants={buttonTapVariants} whileHover="hover" whileTap="tap"
                className="ghost-button"
                style={{
                  borderBottom: '2px solid var(--color-primary)',
                  padding: '0 0 0.3rem',
                  borderRadius: 0,
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: 'var(--color-primary)',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '2px solid var(--color-primary)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                Read More →
              </motion.button>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.div>
  );
}
