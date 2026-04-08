import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants } from '../utils/motionVariants';
import VendorOverview from '../components/VendorOverview';
import VendorInventory from '../components/VendorInventory';
import VendorProfile from '../components/VendorProfile';

export default function VendorDashboard() {
  const [activeView, setActiveView] = useState('overview');

  const navItemStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '1rem 1.5rem',
    borderRadius: '12px',
    cursor: 'pointer',
    background: isActive ? 'var(--color-primary-container)' : 'transparent',
    color: isActive ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
    fontWeight: isActive ? 700 : 500,
    transition: 'all 0.2s',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    fontSize: '0.95rem',
    marginBottom: '0.5rem'
  });

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="dashboard-page" style={{ maxWidth: '1400px', margin: '0 auto', minHeight: '80vh' }}>
      
      <div style={{ display: 'flex', gap: '4rem', marginTop: '3rem' }}>
        
        {/* Left Structural Column */}
        <aside style={{ width: '280px', flexShrink: 0 }}>
          <div style={{ position: 'sticky', top: '120px' }}>
             <h2 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#999', marginBottom: '2rem', paddingLeft: '1.5rem' }}>Menu</h2>
             <nav>
                <button style={navItemStyle(activeView === 'overview')} onClick={() => setActiveView('overview')}>
                   <span style={{ marginRight: '1rem' }}>◎</span> Sales Overview
                </button>
                <button style={navItemStyle(activeView === 'inventory')} onClick={() => setActiveView('inventory')}>
                   <span style={{ marginRight: '1rem' }}>⌬</span> My Products
                </button>
                <button style={navItemStyle(activeView === 'profile')} onClick={() => setActiveView('profile')}>
                   <span style={{ marginRight: '1rem' }}>❂</span> Business Settings
                </button>
             </nav>
             
             <div style={{ marginTop: '4rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
               <h4 style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>System Integrity</h4>
               <p style={{ fontSize: '0.75rem', color: '#666', lineHeight: 1.5 }}>
                 Your deployment pipeline is firmly linked. Data mutations map strictly out to global instances.
               </p>
             </div>
          </div>
        </aside>

        {/* Right Dynamic Rendering Node */}
        <main style={{ flex: 1, paddingBottom: '6rem' }}>
          <AnimatePresence mode="wait">
             {activeView === 'overview' && <motion.div key="v-overview" initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: -20}} transition={{ duration: 0.3 }}><VendorOverview /></motion.div>}
             {activeView === 'inventory' && <motion.div key="v-inventory" initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: -20}} transition={{ duration: 0.3 }}><VendorInventory /></motion.div>}
             {activeView === 'profile'   && <motion.div key="v-profile" initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: -20}} transition={{ duration: 0.3 }}><VendorProfile /></motion.div>}
          </AnimatePresence>
        </main>
        
      </div>

    </motion.div>
  );
}
