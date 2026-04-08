import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Layout from './components/Layout';
import AccountOverview from './pages/AccountOverview';
import MyOrders from './pages/MyOrders';
import WishlistPage from './pages/WishlistPage';
import SavedSettings from './pages/SavedSettings';
import VendorSales from './pages/VendorSales';
import VendorCatalog from './pages/VendorCatalog';
import VendorSettings from './pages/VendorSettings';
import Preloader from './components/Preloader';
import Cursor from './components/Cursor';
import ProtectedRoute from './components/ProtectedRoute';

import Storefront from './pages/Storefront';
import AuthLanding from './pages/AuthLanding';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import VendorDashboard from './pages/VendorDashboard';
import VendorOnboarding from './pages/VendorOnboarding';
import Wishlist from './pages/Wishlist';
import Orders from './pages/Orders';
import Collections from './pages/Collections';
import InteriorDesign from './pages/InteriorDesign';
import Spaces from './pages/Spaces';
import Journal from './pages/Journal';
import SuccessScreen from './pages/SuccessScreen';
import PaymentSuccess from './pages/PaymentSuccess';
import NotFound from './pages/NotFound';

import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import { WishlistProvider } from './context/WishlistContext';
import { SystemProvider, useSystem } from './context/SystemContext';
import { useDocumentTitle } from './hooks/useDocumentTitle';


function AnimatedRoutes() {
  useDocumentTitle();
  const location = useLocation();
  const backgroundLocation = location.pathname === '/checkout' ? { ...location, pathname: '/cart' } : location;

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={backgroundLocation} key={backgroundLocation.pathname}>
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
          <Route path="/vendor/dashboard" element={<ProtectedRoute requiredRole="vendor"><VendorDashboard /></ProtectedRoute>} />
          <Route path="/dashboard" element={<Navigate to="/vendor/dashboard" replace />} />
          <Route path="/account/overview" element={<AccountOverview />} />
          <Route path="/account/orders" element={<MyOrders />} />
          <Route path="/account/wishlist" element={<WishlistPage />} />
          <Route path="/account/settings" element={<SavedSettings />} />
          <Route path="/vendor/sales" element={<ProtectedRoute requiredRole="vendor"><VendorSales /></ProtectedRoute>} />
          <Route path="/vendor/catalog" element={<ProtectedRoute requiredRole="vendor"><VendorCatalog /></ProtectedRoute>} />
          <Route path="/vendor/settings" element={<ProtectedRoute requiredRole="vendor"><VendorSettings /></ProtectedRoute>} />
          <Route path="/vendor/onboarding" element={<VendorOnboarding />} />
          <Route path="/checkout/success" element={<PaymentSuccess />} />
          <Route path="/success" element={<PaymentSuccess />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

      </AnimatePresence>
      
      <AnimatePresence>
        {location.pathname === '/checkout' && <Checkout />}
      </AnimatePresence>
    </>
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
              <WishlistProvider>
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
              </WishlistProvider>
            </CartProvider>
          </SearchProvider>
        </AuthProvider>
      </ToastProvider>
    </SystemProvider>
  );
}

export default App;
