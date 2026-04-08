import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters'; // assume helper exists or fallback to simple formatter

export default function CartDrawer({ isOpen, onClose }) {
  const { cartItems, cartTotal, removeFromCart, updateQuantity } = useCart();

  const handleQuantityChange = (item, delta) => {
    const newQty = Math.max(1, item.quantity + delta);
    updateQuantity(item.id, newQty);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="cart-drawer-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed', inset: 0, background: '#000', zIndex: 999,
            display: 'flex', justifyContent: 'flex-end'
          }}
          onClick={onClose}
        >
          <motion.div
            className="cart-drawer-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              width: '320px', height: '100%', background: 'var(--color-surface-container-lowest)',
              padding: '1.5rem', overflowY: 'auto', boxShadow: '-4px 0 12px rgba(0,0,0,0.2)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontFamily: 'var(--font-display)' }}>Your Bag</h2>
              <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
            </div>
            <hr style={{ margin: '1rem 0', borderColor: 'var(--color-outline-variant)' }} />
            {cartItems.length === 0 ? (
              <p style={{ color: 'var(--color-on-surface-variant)' }}>Your bag is empty.</p>
            ) : (
              cartItems.map(item => (
                <div key={item.cart_item_id || item.id} style={{ display: 'flex', marginBottom: '1rem', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '60px', height: '60px', backgroundImage: `url(${item.image})`,
                      backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '8px', marginRight: '0.75rem'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 600 }}>{item.title}</p>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-on-surface-variant)' }}>
                      {formatCurrency(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <button onClick={() => handleQuantityChange(item, 1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>▲</button>
                    <button onClick={() => handleQuantityChange(item, -1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>▼</button>
                    <button onClick={() => removeFromCart(item.cart_item_id || item.id)} style={{ background: 'none', border: 'none', color: 'var(--color-error)', marginTop: '0.5rem', cursor: 'pointer' }}>✕</button>
                  </div>
                </div>
              ))
            )}
            <hr style={{ margin: '1rem 0', borderColor: 'var(--color-outline-variant)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '1.1rem' }}>
              <span>Total</span>
              <span>{formatCurrency(cartTotal)}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
