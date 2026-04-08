import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { apiClient } from '../api/apiClient';
import { mockProducts } from '../data/mockProducts';
import { formatCurrency } from '../utils/currency';
import { pageVariants, buttonTapVariants } from '../utils/motionVariants';
import '../styles/pages.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSpecificProduct = async () => {
      setIsLoading(true);
      try {
        const data = await apiClient(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        const item = mockProducts.find(p => String(p.id) === String(id));
        if (item) setProduct(item);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSpecificProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="pdp-page">
         <div className="pdp-grid">
           <div className="pdp-image-container skeleton-pulse" style={{ backgroundColor: 'var(--color-surface-dim)' }}></div>
           <div className="pdp-content">
             <div className="skeleton-text title skeleton-pulse" style={{ height: '3rem', width: '80%', marginBottom: '2rem' }}></div>
             <div className="skeleton-text skeleton-pulse" style={{ height: '1.5rem', width: '40%', marginBottom: '2rem' }}></div>
             <div className="skeleton-text skeleton-pulse" style={{ height: '8rem', width: '100%' }}></div>
           </div>
         </div>
      </div>
    );
  }

  if (!product) return <div style={{ padding: '6rem', textAlign: 'center' }}>Product unavailable.</div>;

  const handleAddToCart = () => {
    addToCart(product);
    showToast(`${product.title} mapped to cart.`);
  };

  return (
    <motion.div className="pdp-page" variants={pageVariants} initial="initial" animate="animate" exit="exit">
       <button className="ghost-button" onClick={() => navigate(-1)} style={{ marginBottom: '3rem', fontSize: '1rem', fontWeight: '500' }}>
          &larr; Back to Catalog
       </button>
       <div className="pdp-grid">
         <motion.div className="pdp-image-container" layoutId={`product-frame-${product.id}`}>
           <img src={product.image} alt={product.title} className="pdp-image" />
         </motion.div>
         <div className="pdp-content">
           <span className="pdp-category">{product.category}</span>
           <h1 className="pdp-title">{product.title}</h1>
           <p className="pdp-price">{formatCurrency(product.price)}</p>
           <div className="pdp-description">
             <p>{product.description}</p>
             <p style={{ marginTop: '1.25rem', color: 'var(--color-on-surface-variant)' }}>Crafted with premium materials and an eye for detail, this piece offers both visual impact and everyday practicality in any interior.</p>
           </div>
           
           <motion.button 
             variants={buttonTapVariants} whileHover="hover" whileTap="tap"
             className="primary-cta full-width pdp-add-to-cart" 
             onClick={handleAddToCart} 
             style={{ padding: '1rem', fontSize: '1.05rem', marginTop: '3rem' }}
           >
             Add to Cart
           </motion.button>
         </div>
       </div>
    </motion.div>
  );
}
