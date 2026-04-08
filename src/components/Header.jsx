import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './Navigation';
import Magnetic from './Magnetic';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';
import { buttonTapVariants } from '../utils/motionVariants';
import '../styles/layout.css';

export default function Header() {
  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();
  const navigate = useNavigate();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    logout();
    navigate('/');
  };

  const closeMenus = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="site-header">
        <div className="header-brand" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="hamburger" onClick={() => setIsMobileMenuOpen(true)}>☰</button>
          <Magnetic>
            <Link to="/" style={{ textDecoration: 'none', display: 'block' }} onClick={() => setSearchQuery('')}>
              <h1 className="logo">CuratedSpace</h1>
            </Link>
          </Magnetic>
        </div>
        
        <div className="desktop-only"><Navigation /></div>
        
        <div className="header-actions" style={{ display: 'flex', gap: '2rem', alignItems: 'center', position: 'relative' }}>
          
          <motion.div 
            className="search-container"
            initial={{ width: '150px' }} 
            animate={{ width: isSearchFocused || searchQuery ? '240px' : '150px' }} 
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            style={{ position: 'relative' }}
          >
            <input 
              type="text" placeholder="Search parameters..." value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); if(window.location.pathname !== '/') navigate('/'); }}
              onFocus={() => setIsSearchFocused(true)} onBlur={() => setIsSearchFocused(false)}
              style={{
                 width: '100%', padding: '0.4rem 1.2rem', borderRadius: 'var(--radius-xl)',
                 border: isSearchFocused ? '1px solid var(--color-primary)' : '1px solid var(--color-outline-variant)',
                 background: 'transparent', fontFamily: 'var(--font-body)', fontSize: '0.9rem',
                 outline: 'none', transition: 'border 0.2s ease', color: 'var(--color-on-surface)'
              }}
            />
          </motion.div>

          {(!user || (user && user?.role && user?.role.toLowerCase() !== 'vendor')) && (
            <Magnetic>
              <Link to="/cart" className="nav-link" style={{ fontWeight: '600' }}>
                Bag {cartCount > 0 && `(${cartCount})`}
              </Link>
            </Magnetic>
          )}
          
          {user ? (
            <div style={{ position: 'relative' }} className="auth-button-desktop">
               <Magnetic>
                 <motion.button 
                   variants={buttonTapVariants} whileHover="hover" whileTap="tap" className="ghost-button" 
                   onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                   style={{ border: '1px solid var(--color-outline-variant)', padding: '0.4rem 1rem', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}
                 >
                   My Account <span style={{ fontSize: '0.7rem' }}>▼</span>
                 </motion.button>
               </Magnetic>
               
               <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="account-dropdown"
                      style={{
                        position: 'absolute',
                        top: '120%',
                        right: 0,
                        width: '240px',
                        background: 'var(--color-surface-container-lowest)',
                        border: '1px solid rgba(195, 198, 215, 0.2)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                        borderRadius: 'var(--radius-lg)',
                        zIndex: 9999,
                        overflow: 'hidden',
                      }}
                    >
                      <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--color-surface-variant)' }}>
                        <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-on-surface)' }}>
                          Hello, {user?.name || user?.email?.split('@')[0] || 'there'}
                        </p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-on-surface-variant)', marginTop: '0.2rem' }}>
                          {user?.role?.toLowerCase() === 'vendor' ? 'Seller Account' : 'My Account'}
                        </p>
                      </div>
                      <div style={{ padding: '0.5rem 0' }} className="dropdown-links">
                        {user?.role?.toLowerCase() === 'vendor' ? (
                          <>
                            <Link to="/vendor/sales" className="dropdown-item" onClick={closeMenus}>My Sales</Link>
                            <Link to="/vendor/catalog" className="dropdown-item" onClick={closeMenus}>My Products</Link>
                            <Link to="/vendor/settings" className="dropdown-item" onClick={closeMenus}>Business Settings</Link>
                          </>
                        ) : (
                          <>
                            <Link to="/account/overview" className="dropdown-item" onClick={closeMenus}>Account Overview</Link>
                            <Link to="/account/orders" className="dropdown-item" onClick={closeMenus}>My Orders</Link>
                            <Link to="/account/wishlist" className="dropdown-item" onClick={closeMenus}>Wishlist</Link>
                            <Link to="/account/settings" className="dropdown-item" onClick={closeMenus}>Saved Settings</Link>
                          </>
                        )}
                      </div>
                      <div style={{ height: '1px', background: 'var(--color-surface-variant)', margin: '0.5rem 0' }}></div>
                      <button
                        className="dropdown-item"
                        onClick={handleLogout}
                        style={{ width: '100%', textAlign: 'left', color: 'var(--color-error)', padding: '0.75rem 1.25rem' }}
                      >
                        Sign Out Session
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
            </div>
          ) : (
            <Magnetic>
              <Link to="/auth" className="auth-button-desktop" style={{ display: 'block' }}>
                <button className="primary-cta" style={{ padding: '0.5rem 1.25rem' }}>Sign In</button>
              </Link>
            </Magnetic>
          )}
        </div>
      </header>
      
      {/* Mobile Drawer Array */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 999 }}
               onClick={closeMenus}
            ></motion.div>
            <motion.div 
               initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
               style={{ position: 'fixed', top: 0, bottom: 0, left: 0, width: '280px', background: 'var(--color-surface-container-lowest)', zIndex: 1000, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', overflowY: 'auto' }}
            >
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <h2 className="logo" style={{ fontSize: '1.25rem', margin: 0 }}>CuratedSpace</h2>
                 <button className="ghost-button" onClick={closeMenus} style={{ padding: '0.5rem' }}>✕</button>
               </div>
               
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 <Link to="/" className="nav-link" onClick={closeMenus}>Home</Link>
                 <Link to="/collections" className="nav-link" onClick={closeMenus}>Categories</Link>
                 {/* Design Services link hidden on mobile as per Step 109 */}
                 <Link to="/spaces" className="nav-link" onClick={closeMenus}>Inspiration</Link>
                 <Link to="/journal" className="nav-link" onClick={closeMenus}>Blog</Link>
                 {user && String(user?.role).toLowerCase() === 'vendor' && <Link to="/vendor/dashboard" className="nav-link" onClick={closeMenus} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Seller Dashboard</Link>}
               </div>
               
               <div style={{ height: '1px', background: 'var(--color-surface-variant)' }}></div>
               
               {user ? (
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p style={{ fontWeight: 600, fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--color-on-surface-variant)' }}>My Core Space</p>
                    <Link to="/profile" className="nav-link" onClick={closeMenus}>Account Overview</Link>
                    <Link to="/orders" className="nav-link" onClick={closeMenus}>My Orders</Link>
                    <Link to="/wishlist" className="nav-link" onClick={closeMenus}>Wishlist</Link>
                    <button className="nav-link" onClick={handleLogout} style={{ textAlign: 'left', color: 'var(--color-error)', border: 'none', background: 'transparent', padding: 0 }}>Sign Out</button>
                 </div>
               ) : (
                 <Link to="/auth" onClick={closeMenus}><button className="primary-cta" style={{ width: '100%' }}>Sign In to Network</button></Link>
               )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
