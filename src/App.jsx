import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Layout from './components/Layout';
import Preloader from './components/Preloader';
import Cursor from './components/Cursor';

import Storefront from './pages/Storefront';
import AuthLanding from './pages/AuthLanding';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import VendorDashboard from './pages/VendorDashboard';
import Wishlist from './pages/Wishlist';
import Orders from './pages/Orders';
import Collections from './pages/Collections';
import InteriorDesign from './pages/InteriorDesign';
import Spaces from './pages/Spaces';
import Journal from './pages/Journal';
import NotFound from './pages/NotFound';

import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import { SystemProvider, useSystem } from './context/SystemContext';
import { useDocumentTitle } from './hooks/useDocumentTitle';

function AnimatedRoutes() {
  useDocumentTitle();
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Storefront />} />
        
        <Route path="/collections" element={<Collections />} />
        <Route path="/interior-design" element={<InteriorDesign />} />
        <Route path="/spaces" element={<Spaces />} />
        <Route path="/journal" element={<Journal />} />
        
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Storefront />} />
        <Route path="/settings" element={<Storefront />} />
        
        <Route path="/auth" element={<AuthLanding />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/dashboard" element={<VendorDashboard />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

function SystemControls() {
  const { isMuted, setIsMuted, performanceMode, setPerformanceMode } = useSystem();
  return (
    <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 999999, display: 'flex', gap: '0.75rem' }}>
       <button onClick={() => setIsMuted(!isMuted)} className="ghost-button" style={{ 
          background: 'var(--color-surface-container-lowest)', border: '1px solid var(--color-outline-variant)', borderRadius: '50px', padding: '0.4rem 0.8rem', fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-on-surface)' 
       }}>
         {isMuted ? 'SOUND: OFF' : 'SOUND: ON'}
       </button>
       <button onClick={() => setPerformanceMode(!performanceMode)} className="ghost-button" style={{ 
          background: 'var(--color-surface-container-lowest)', border: '1px solid var(--color-outline-variant)', borderRadius: '50px', padding: '0.4rem 0.8rem', fontSize: '0.65rem', fontWeight: 800, color: performanceMode ? 'var(--color-primary)' : 'var(--color-on-surface)' 
       }}>
         {performanceMode ? 'PERF: MAX' : 'PERF: RICH'}
       </button>
    </div>
  );
}

function App() {
  const [isPreloading, setIsPreloading] = useState(true);

  return (
    <SystemProvider>
      <ToastProvider>
        <AuthProvider>
          <SearchProvider>
            <CartProvider>
              
              <Router>
                <Cursor />
                <AnimatePresence mode="wait">
                  {isPreloading && <Preloader key="global-preloader" onComplete={() => setIsPreloading(false)} />}
                </AnimatePresence>

                <div style={{ pointerEvents: isPreloading ? 'none' : 'auto' }}>
                  <Layout>
                    <AnimatedRoutes />
                  </Layout>
                </div>
                
                <SystemControls />
              </Router>

            </CartProvider>
          </SearchProvider>
        </AuthProvider>
      </ToastProvider>
    </SystemProvider>
  );
}

export default App;
