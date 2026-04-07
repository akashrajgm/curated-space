import React from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/currency';
import { mockProducts } from '../data/mockProducts';
import { pageVariants, cardHoverVariants, buttonTapVariants } from '../utils/motionVariants';
import '../styles/pages.css';

export default function Wishlist() {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  
  // Using fixed mock data slice to represent a pre-saved wishlist footprint
  const wishlist = mockProducts.slice(4, 7);
  
  const handleMove = (item) => {
    addToCart(item);
    showToast(`Structural unit '${item.title}' shifted beautifully to Cart.`);
  };

  return (
    <motion.div className="wishlist-page" variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ padding: '2rem 0' }}>
       <h1 className="page-title">Curated Tracking</h1>
       
       <div className="products-grid">
         {wishlist.map(product => (
            <motion.div key={product.id} className="product-card" variants={cardHoverVariants} whileHover="hover" whileTap="tap">
               <div className="product-image-container" style={{ backgroundImage: `url(${product.image})` }}></div>
               <h3>{product.title}</h3>
               <p>{product.description}</p>
               <div className="product-price-row">
                 <span className="price">{formatCurrency(product.price)}</span>
                 <motion.button 
                   variants={buttonTapVariants} whileHover="hover" whileTap="tap"
                   className="primary-cta" style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}
                   onClick={() => handleMove(product)}
                 > 
                   Push to Cart 
                 </motion.button>
               </div>
            </motion.div>
         ))}
       </div>
    </motion.div>
  );
}
