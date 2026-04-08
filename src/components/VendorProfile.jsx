import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { apiClient } from '../api/apiClient';
import { useToast } from '../context/ToastContext';
import { buttonTapVariants } from '../utils/motionVariants';

export default function VendorProfile() {
  const { showToast } = useToast();
  const [vendorDetails, setVendorDetails] = useState({ company_name: '', address: '', bio: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProfileSetup = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiClient('/vendors/profile', { 
         method: 'POST', 
         headers: { 'Content-Type': 'application/json' }, 
         body: JSON.stringify(vendorDetails) 
      });
      showToast('Studio parameters synchronized securely to edge.');
    } catch (err) {
      showToast('Synchronization failed. Verify data payload.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 style={{fontSize: '2.5rem', marginBottom: '2rem', fontFamily: 'var(--font-display)', letterSpacing: '-1px'}}>Store Profile</h1>
      <div className="dashboard-card" style={{ maxWidth: '600px', background: 'var(--color-surface-container-lowest)', border: '1px solid var(--color-outline-variant)', padding: '3rem', borderRadius: 'var(--radius-xl)' }}>
         <form className="auth-form" onSubmit={handleProfileSetup}>
            <div className="form-group">
               <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-on-surface-variant)' }}>Store Name</label>
               <input required type="text" value={vendorDetails.company_name} onChange={e => setVendorDetails({...vendorDetails, company_name: e.target.value})} style={{ padding: '1rem', border: '1px solid var(--color-outline-variant)', borderRadius: '4px', width: '100%', outline: 'none' }} />
            </div>
            <div className="form-group">
               <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-on-surface-variant)' }}>Business Address</label>
               <input required type="text" value={vendorDetails.address} onChange={e => setVendorDetails({...vendorDetails, address: e.target.value})} style={{ padding: '1rem', border: '1px solid var(--color-outline-variant)', borderRadius: '4px', width: '100%', outline: 'none' }} />
            </div>
            <div className="form-group">
               <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-on-surface-variant)' }}>About Your Business</label>
               <textarea rows="4" value={vendorDetails.bio} onChange={e => setVendorDetails({...vendorDetails, bio: e.target.value})} style={{ padding: '1rem', border: '1px solid var(--color-outline-variant)', borderRadius: '4px', width: '100%', outline: 'none', resize: 'vertical', fontFamily: 'var(--font-body)' }}></textarea>
            </div>
            <motion.button variants={buttonTapVariants} whileHover="hover" whileTap="tap" disabled={isSubmitting} type="submit" className="primary-cta" style={{ width: '100%', marginTop: '1rem' }}>
               Save Changes
            </motion.button>
         </form>
      </div>
    </motion.div>
  );
}
