import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageVariants, buttonTapVariants } from '../utils/motionVariants';
import '../styles/pages.css';

const ROOMS = [
  {
    title: 'The Modern Living Room',
    subtitle: 'Clean lines, warm tones, intentional comfort.',
    category: 'Sofas',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    title: 'Minimalist Home Office',
    subtitle: 'Where focus meets form. Distraction-free by design.',
    category: 'Chairs',
    images: [
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    title: 'Luxury Bedroom',
    subtitle: 'Rest as a ritual. Every detail earns its place.',
    category: 'Interior Decor',
    images: [
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?auto=format&fit=crop&w=600&q=80',
    ],
  },
];

function RoomSection({ room, index, navigate }) {
  const isEven = index % 2 === 0;
  return (
    <motion.section
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{ marginBottom: '6rem' }}
    >
      {/* Section label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ width: '32px', height: '1px', background: 'var(--color-primary)' }} />
        <span style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: 600 }}>
          Room {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 3rem)', letterSpacing: '-0.04em', color: 'var(--color-on-surface)', margin: '0 0 0.5rem' }}>
        {room.title}
      </h2>
      <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '1.05rem', marginBottom: '2rem' }}>
        {room.subtitle}
      </p>

      {/* Image bento grid */}
      <div className={`bento-grid-spaces ${isEven ? 'even' : 'odd'}`}>
        {/* Large image */}
        <div className="bento-large-image" style={{ borderRadius: '16px', overflow: 'hidden' }}>
          <img loading="lazy" src={room.images[0]} alt={room.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        {/* Two stacked small images */}
        <div style={{ borderRadius: '16px', overflow: 'hidden', minHeight: '200px' }}>
          <img loading="lazy" src={room.images[1]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ borderRadius: '16px', overflow: 'hidden', minHeight: '200px' }}>
          <img loading="lazy" src={room.images[2]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>

      {/* Shop CTA */}
      <div style={{ marginTop: '1.5rem' }}>
        <motion.button
          variants={buttonTapVariants} whileHover="hover" whileTap="tap"
          className="ghost-button"
          onClick={() => navigate(`/?category=${room.category}`)}
          style={{ border: '1px solid var(--color-outline-variant)', borderRadius: '999px', padding: '0.65rem 1.5rem', fontSize: '0.9rem' }}
        >
          Shop this look →
        </motion.button>
      </div>
    </motion.section>
  );
}

export default function Spaces() {
  const navigate = useNavigate();
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
      style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem 6rem' }}
    >
      {/* Hero header */}
      <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <p style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: 600, marginBottom: '1rem' }}>
          Lookbook
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', letterSpacing: '-0.05em', color: 'var(--color-on-surface)', margin: '0 0 1rem' }}>
          Inspiration
        </h1>
        <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>
          Real rooms. Real furniture. See how our pieces come to life in beautifully styled spaces.
        </p>
      </div>

      {ROOMS.map((room, i) => (
        <RoomSection key={room.title} room={room} index={i} navigate={navigate} />
      ))}
    </motion.div>
  );
}
