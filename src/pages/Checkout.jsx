import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { apiClient } from '../api/apiClient';
import { formatCurrency } from '../utils/currency';
import { pageVariants, buttonTapVariants } from '../utils/motionVariants';
import '../styles/pages.css';

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', address: '', city: '', zipCode: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cartItems.length === 0) {
    return (
      <motion.div className="checkout-page empty" variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <div className="cart-empty-state">
          <h2>No items to checkout</h2>
          <button onClick={() => navigate('/')} className="primary-cta" style={{ marginTop: '1.5rem' }}>
            Return to Storefront
          </button>
        </div>
      </motion.div>
    );
  }

  const handleInputChange = (e) => setFormData({...formData, [e.target.id]: e.target.value});

  const handleCheckout = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const payload = {
      customer: formData,
      items: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      })),
      total: cartTotal
    };

    try {
      await apiClient('/orders', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload) });
      alert('Order finalized cleanly hitting DB!');
      clearCart();
      navigate('/');
    } catch (error) {
      alert('API transaction block. Fix backend paths and verify schemas.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div className="checkout-page" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <h1 className="page-title">Checkout</h1>
      
      <div className="checkout-layout">
        <form className="checkout-form checkout-card" onSubmit={handleCheckout}>
          <h2 className="section-title">Shipping Details</h2>
          
          <div className="form-row">
            <div className="form-group half"><label>First Name</label><input type="text" id="firstName" value={formData.firstName} onChange={handleInputChange} required /></div>
            <div className="form-group half"><label>Last Name</label><input type="text" id="lastName" value={formData.lastName} onChange={handleInputChange} required /></div>
          </div>
          <div className="form-group"><label>Email Address</label><input type="email" id="email" value={formData.email} onChange={handleInputChange} required /></div>
          <div className="form-group"><label>Street Address</label><input type="text" id="address" value={formData.address} onChange={handleInputChange} required /></div>
          <div className="form-row">
            <div className="form-group half"><label>City</label><input type="text" id="city" value={formData.city} onChange={handleInputChange} required /></div>
            <div className="form-group half"><label>Zip Code</label><input type="text" id="zipCode" value={formData.zipCode} onChange={handleInputChange} required /></div>
          </div>

          <motion.button variants={buttonTapVariants} whileHover="hover" whileTap="tap" type="submit" className="primary-cta full-width" disabled={isSubmitting} style={{ marginTop: '2.5rem' }}>
            {isSubmitting ? 'Processing...' : `Place Order • ${formatCurrency(cartTotal)}`}
          </motion.button>
        </form>

        <div className="checkout-summary checkout-card">
          <h2 className="section-title">Your Box</h2>
          <div className="summary-items">
            {cartItems.map(item => {
               const priceNum = typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.-]+/g, "")) : (item.price || 0);
               return (
                <div key={item.cart_item_id || item.id} className="summary-item">
                  <span className="summary-item-title">{item.title} x{item.quantity}</span>
                  <span className="summary-item-price">{formatCurrency(priceNum * item.quantity)}</span>
                </div>
               );
            })}
          </div>
          <div className="summary-total-div">
            <span>Total to pay</span>
            <span className="total-price">{formatCurrency(cartTotal)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
