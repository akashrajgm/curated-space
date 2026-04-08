import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { buttonTapVariants } from '../utils/motionVariants';
import '../styles/pages.css';

// Floating animation — the card gently hovers into view and bobs
const floatVariants = {
  initial: { opacity: 0, y: 60, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const bobVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(8);

  // Auto-redirect countdown
  useEffect(() => {
    const tick = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(tick);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        background: 'var(--color-background)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Soft radial glow behind card */}
      <div style={{
        position: 'absolute',
        width: '600px', height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Main card — floats in then gently bobs */}
      <motion.div
        variants={floatVariants}
        initial="initial"
        animate="animate"
        style={{
          maxWidth: '520px',
          width: '100%',
          background: 'var(--color-surface-container-lowest)',
          border: '1px solid var(--color-outline-variant)',
          borderRadius: '28px',
          padding: '3.5rem 3rem',
          boxShadow: '0 24px 80px rgba(0,0,0,0.08)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Bobbing checkmark */}
        <motion.div variants={bobVariants} animate="animate">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.3 }}
            style={{
              width: '80px', height: '80px',
              borderRadius: '50%',
              background: 'rgba(99,102,241,0.1)',
              border: '2px solid var(--color-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 2rem',
            }}
          >
            <motion.svg
              viewBox="0 0 24 24" width="38" height="38"
              fill="none" stroke="var(--color-primary)"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            >
              <motion.polyline
                points="20 6 9 17 4 12"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              />
            </motion.svg>
          </motion.div>
        </motion.div>

        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            fontSize: '0.7rem', letterSpacing: '0.2em',
            textTransform: 'uppercase', color: 'var(--color-primary)',
            fontWeight: 700, marginBottom: '0.75rem',
          }}
        >
          Order Confirmed
        </motion.p>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
            letterSpacing: '-0.04em',
            color: 'var(--color-on-surface)',
            lineHeight: 1.2,
            marginBottom: '1rem',
          }}
        >
          Your order is on its way!
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          style={{
            color: 'var(--color-on-surface-variant)',
            fontSize: '0.95rem',
            lineHeight: 1.65,
            marginBottom: '2.5rem',
          }}
        >
          A confirmation email has been sent to your inbox. We're getting everything ready for you.
        </motion.p>

        {/* Email sent badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.85 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: 'rgba(34,197,94,0.08)',
            border: '1px solid rgba(34,197,94,0.2)',
            borderRadius: '999px',
            fontSize: '0.8rem', fontWeight: 600,
            color: '#16a34a',
            marginBottom: '2.5rem',
          }}
        >
          <span>📧</span> Confirmation email dispatched
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95 }}
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <motion.button
            variants={buttonTapVariants} whileHover="hover" whileTap="tap"
            className="primary-cta"
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </motion.button>
          <motion.button
            variants={buttonTapVariants} whileHover="hover" whileTap="tap"
            className="ghost-button"
            onClick={() => navigate('/account/orders')}
            style={{ border: '1px solid var(--color-outline-variant)', borderRadius: 'var(--radius-xl)', padding: '0.75rem 1.5rem' }}
          >
            View My Orders
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Countdown */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        style={{ marginTop: '2rem', fontSize: '0.75rem', color: 'var(--color-on-surface-variant)', opacity: 0.5 }}
      >
        Redirecting to home in {countdown} second{countdown !== 1 ? 's' : ''}…
      </motion.p>
    </motion.div>
  );
}
