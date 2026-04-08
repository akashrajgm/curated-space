import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { buttonTapVariants } from '../utils/motionVariants';
import '../styles/pages.css';

export default function PaymentSuccess() {
  const navigate = useNavigate();

  // Auto-redirect to storefront after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => navigate('/'), 8000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        background: 'var(--color-background)',
      }}
    >
      {/* Animated checkmark ring */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.2 }}
        style={{
          width: '96px',
          height: '96px',
          borderRadius: '50%',
          border: '3px solid var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2.5rem',
        }}
      >
        <motion.svg
          viewBox="0 0 24 24"
          width="44" height="44"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <motion.polyline
            points="20 6 9 17 4 12"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          />
        </motion.svg>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{
          fontSize: '0.75rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--color-primary)',
          marginBottom: '1rem',
          fontWeight: 600,
        }}
      >
        Order Confirmed
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.8rem, 4vw, 3rem)',
          letterSpacing: '-0.04em',
          color: 'var(--color-on-surface)',
          maxWidth: '520px',
          lineHeight: 1.2,
          marginBottom: '1.5rem',
        }}
      >
        Your architectural selections are being prepared.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        style={{
          color: 'var(--color-on-surface-variant)',
          fontSize: '1rem',
          maxWidth: '380px',
          lineHeight: 1.6,
          marginBottom: '3rem',
        }}
      >
        A confirmation has been dispatched to your registered address. You will be redirected shortly.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}
      >
        <motion.button
          variants={buttonTapVariants} whileHover="hover" whileTap="tap"
          className="primary-cta"
          onClick={() => navigate('/')}
        >
          Return to Showroom
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

      {/* Subtle redirect countdown hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        style={{
          marginTop: '3rem',
          fontSize: '0.75rem',
          color: 'var(--color-on-surface-variant)',
          opacity: 0.5,
        }}
      >
        Redirecting to showroom in 8 seconds…
      </motion.p>
    </motion.div>
  );
}
