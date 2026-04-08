import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/currency';
import { pageVariants, buttonTapVariants } from '../utils/motionVariants';
import '../styles/pages.css';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <motion.div className="cart-page empty" variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <div className="cart-empty-state">
          <h2>Your cart is empty</h2>
          <p>Discover pieces that define modern living.</p>
          <Link to="/" className="primary-cta" style={{ display: 'inline-block', marginTop: '1.5rem', textDecoration: 'none' }}>
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div className="cart-page" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <h1 className="page-title">Shopping Cart</h1>
      
      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.cart_item_id || item.id} className="cart-item-card">
               <div className="cart-item-thumb" style={{ backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
              <div className="cart-item-details">
                <h3>{item.title}</h3>
                <p>{formatCurrency(item.price)}</p>
              </div>
              <div className="cart-item-actions">
                <input 
                  type="number" 
                  value={item.quantity} 
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                  min="1"
                />
                <button onClick={() => removeFromCart(item.cart_item_id || item.id)} className="ghost-button">Remove</button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row" style={{ marginTop: '1.5rem' }}>
            <span>Subtotal</span>
            <span>{formatCurrency(cartTotal)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Calculated automatically</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>{formatCurrency(cartTotal)}</span>
          </div>
          <Link to="/checkout" style={{ textDecoration: 'none' }}>
            <motion.button variants={buttonTapVariants} whileHover="hover" whileTap="tap" className="primary-cta full-width" style={{ marginTop: '2rem', display: 'block', textAlign: 'center' }}>
              Proceed to Checkout
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
