import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/currency';
import { pageVariants, cardHoverVariants, buttonTapVariants } from '../utils/motionVariants';
import ArchitecturalImage from '../components/ArchitecturalImage';
import '../styles/pages.css';

export default function WishlistPage() {
  const { user } = useAuth();
  const { wishlist, loading, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '1.1rem' }}>
          Sign in to view your wishlist.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-on-surface-variant)' }}>Loading wishlist...</p>
      </div>
    );
  }

  const handleMoveToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
    showToast(`${product.title || product.name || 'Item'} moved to cart.`);
  };

  const handleRemove = (e, product) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <motion.div
      className="wishlist-page"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ padding: '2rem' }}
    >
      <h2 className="page-title" style={{ marginBottom: '2rem' }}>Your Wishlist</h2>

      {wishlist.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '6rem 2rem', color: 'var(--color-on-surface-variant)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>♡</div>
          <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Your wishlist is empty.</p>
          <motion.button
            variants={buttonTapVariants} whileHover="hover" whileTap="tap"
            className="primary-cta"
            onClick={() => navigate('/')}
          >
            Start Shopping
          </motion.button>
        </div>
      ) : (
        <div className="products-grid">
          <AnimatePresence>
            {wishlist.map((product, i) => {
              const title = product?.title || product?.name || 'Curated Product';
              const price = product?.price || 0;
              const image = product?.image || '';
              const inWishlist = true; // All items in this page are in wishlist

              return (
                <motion.div
                  key={product?.id}
                  className="product-card"
                  layout
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  whileHover="hover" whileTap="tap" variants={cardHoverVariants}
                  onClick={() => navigate(`/product/${product?.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Image + heart overlay */}
                  <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
                    <ArchitecturalImage
                      src={image}
                      alt={title}
                      className="product-image-container"
                      style={{ background: 'transparent' }}
                    />
                    {/* Remove from wishlist button */}
                    <button
                      onClick={(e) => handleRemove(e, product)}
                      title="Remove from wishlist"
                      style={{
                        position: 'absolute', top: '10px', right: '10px',
                        background: 'rgba(255,255,255,0.85)',
                        backdropFilter: 'blur(6px)',
                        border: 'none', borderRadius: '50%',
                        width: '36px', height: '36px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', zIndex: 10,
                        transition: 'transform 0.2s ease',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18"
                        fill="var(--color-primary)"
                        stroke="var(--color-primary)"
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                  </div>

                  <h3 style={{ marginTop: '1rem' }}>{title}</h3>
                  {product.description && <p>{product.description}</p>}

                  <div className="product-price-row">
                    <span className="price">{formatCurrency(price)}</span>
                    <motion.button
                      variants={buttonTapVariants} whileHover="hover" whileTap="tap"
                      className="primary-cta"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                      onClick={(e) => handleMoveToCart(e, product)}
                    >
                      Add to Cart
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
