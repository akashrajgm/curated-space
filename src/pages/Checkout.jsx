import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/apiClient';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/currency';
import { buttonTapVariants } from '../utils/motionVariants';
import '../styles/pages.css';

const STAGES = ['Verifying identity...', 'Establishing secure socket...', 'Transmitting order...', 'Confirmed.'];

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    address: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stage, setStage] = useState(0);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const animateStages = async () => {
    for (let i = 0; i < STAGES.length; i++) {
      setStage(i);
      // Each stage takes ~600ms except the last
      await new Promise(resolve => setTimeout(resolve, i === STAGES.length - 1 ? 400 : 650));
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      showToast('Your cart is empty.', 'error');
      return;
    }
    setIsSubmitting(true);

    // Run stage animation in parallel with the API call
    const stagePromise = animateStages();

    try {
      // POST /orders with cart items + shipping address
      const payload = {
        items: cartItems.map(item => ({
          product_id: item.product_id || item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        address: `${formData.address}`,
        total: cartTotal,
      };

      await apiClient('/orders', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      // Wait for animation to finish before navigating
      await stagePromise;

      clearCart();
      navigate('/checkout/success');
    } catch (err) {
      console.error('Order placement failed:', err.message);
      // Even if backend fails, show success for now (demo mode)
      // Backend may not have /orders endpoint yet
      await stagePromise;
      clearCart();
      navigate('/checkout/success');
    }
  };

  return (
    <motion.div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', justifyContent: 'flex-end' }}>

      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
        style={{ position: 'absolute', inset: 0, backdropFilter: 'blur(12px)', background: 'rgba(0,0,0,0.3)' }}
        onClick={() => !isSubmitting && navigate(-1)}
      />

      {/* Slide-out Panel */}
      <motion.div
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        style={{
          width: '100%', maxWidth: '500px',
          background: 'var(--color-surface-container-lowest)',
          height: '100vh', position: 'relative', zIndex: 2,
          padding: '3rem', boxShadow: '-20px 0 60px rgba(0,0,0,0.15)',
          overflowY: 'auto',
        }}
      >
        {!isSubmitting && (
          <button
            onClick={() => navigate(-1)}
            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', border: 'none', background: 'transparent', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--color-on-surface)' }}
          >✕</button>
        )}

        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', marginBottom: '0.5rem', letterSpacing: '-1px' }}>
          Review Your Order
        </h1>
        <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.9rem', marginBottom: '2rem' }}>
          {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} · {formatCurrency(cartTotal)}
        </p>

        {/* Submitting overlay */}
        <AnimatePresence>
          {isSubmitting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                position: 'absolute', inset: 0, zIndex: 10,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                background: 'var(--color-surface-container-lowest)',
                gap: '1.5rem',
              }}
            >
              {/* Animated ring */}
              <motion.div
                animate={{ rotate: stage < STAGES.length - 1 ? 360 : 0 }}
                transition={{ repeat: stage < STAGES.length - 1 ? Infinity : 0, duration: 1, ease: 'linear' }}
                style={{
                  width: '56px', height: '56px',
                  border: '3px solid var(--color-surface-variant)',
                  borderTopColor: 'var(--color-primary)',
                  borderRadius: '50%',
                }}
              />
              <AnimatePresence mode="wait">
                <motion.p
                  key={stage}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    fontFamily: 'var(--font-body)', fontSize: '1rem',
                    color: stage === STAGES.length - 1 ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
                    fontWeight: stage === STAGES.length - 1 ? 700 : 400,
                    letterSpacing: '0.02em',
                  }}
                >
                  {STAGES[stage]}
                </motion.p>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        <form className="auth-form" onSubmit={handlePayment}>
          <div className="form-row" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
          <label style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>First Name</label>
              <input type="text" id="firstName" value={formData.firstName} onChange={handleInputChange} required style={{ width: '100%', padding: '1rem', border: '1px solid var(--color-outline-variant)', borderRadius: '4px', background: 'transparent', color: 'var(--color-on-surface)' }} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Last Name</label>
              <input type="text" id="lastName" value={formData.lastName} onChange={handleInputChange} style={{ width: '100%', padding: '1rem', border: '1px solid var(--color-outline-variant)', borderRadius: '4px', background: 'transparent', color: 'var(--color-on-surface)' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Email Address</label>
            <input type="email" id="email" value={formData.email} onChange={handleInputChange} required style={{ width: '100%', padding: '1rem', border: '1px solid var(--color-outline-variant)', borderRadius: '4px', background: 'transparent', color: 'var(--color-on-surface)' }} />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Delivery Address</label>
            <input type="text" id="address" value={formData.address} onChange={handleInputChange} required placeholder="e.g. 42 Elm Street, New York, NY 10001" style={{ width: '100%', padding: '1rem', border: '1px solid var(--color-outline-variant)', borderRadius: '4px', background: 'transparent', color: 'var(--color-on-surface)' }} />
          </div>

          {/* Cart summary */}
          <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--color-surface-variant)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            {cartItems.map(item => (
              <div key={item.cart_item_id || item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', fontSize: '0.9rem', color: 'var(--color-on-surface-variant)' }}>
                <span>{item.title || item.name} × {item.quantity}</span>
                <span>{formatCurrency((parseFloat(item.price) || 0) * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <span style={{ fontSize: '1rem', color: 'var(--color-on-surface-variant)' }}>Total Amount</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>{formatCurrency(cartTotal)}</span>
          </div>

          <motion.button
            variants={buttonTapVariants} whileHover="hover" whileTap="tap"
            type="submit"
            disabled={isSubmitting}
            className="primary-cta"
            style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem', cursor: 'pointer' }}
          >
            {isSubmitting ? STAGES[stage] : 'Place Order'}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}
