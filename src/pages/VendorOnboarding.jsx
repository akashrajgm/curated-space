import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { apiClient, getAuthToken } from '../api/apiClient';
import { pageVariants, buttonTapVariants } from '../utils/motionVariants';

const GridOverlay = () => (
  <div style={{
    position: 'absolute', inset: 0,
    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
    backgroundSize: '40px 40px',
    opacity: 0.5,
    pointerEvents: 'none',
    zIndex: 1
  }} />
);

export default function VendorOnboarding() {
  const { showToast } = useToast();
  const { setUser, logout, fetchUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ business_name: '', description: '' });
  const [isLoading, setIsLoading] = useState(false);

  // ─── Onboarding Guard ───────────────────────────────────────────────────────
  // If no token exists in localStorage, bounce the user to /auth immediately.
  useEffect(() => {
    const token = getAuthToken();
    console.log('🔒 ONBOARDING GUARD — token present:', !!token, '| value:', token);
    if (!token) {
      showToast('Session expired. Please log in again.', 'error');
      navigate('/auth', { replace: true });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      business_name: formData.business_name,
      description: formData.description,
    };

    // ─── Diagnostic token log ─────────────────────────────────────────────────
    const currentToken = getAuthToken();
    console.log('🔑 SENDING TOKEN:', currentToken);
    console.log('📤 VENDOR PROFILE PAYLOAD:', payload);

    try {
      // apiClient automatically attaches Bearer token from localStorage ('jwt')
      // and throws on non-2xx responses — no need for res.ok checks.
      const data = await apiClient('/vendors/profile', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      console.log('✅ Vendor profile created:', data);

      // Refresh global user state so vendor_profile is immediately available
      await fetchUser();

      showToast('Your store is ready! Welcome aboard.', 'success');
      navigate('/vendor/dashboard');

    } catch (err) {
      console.error('Studio Genesis Exception:', err.message);

      // ─── 401 Auto-Logout: token is stale/invalid, force re-authentication ──
      if (err.message && (err.message.includes('401') || err.message.toLowerCase().includes('not authenticated') || err.message.toLowerCase().includes('unauthorized'))) {
        showToast('Session expired — please log in again to re-sync your token.', 'error');
        logout();
        navigate('/auth', { replace: true });
        return;
      }

      if (err.message && err.message.includes('403')) {
        showToast('Backend Role Mismatch — contact Tharun to verify vendor role in DB.', 'error');
      } else {
        showToast(err.message || 'Failed to save store details. Please try again.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '1rem 1.2rem', borderRadius: '4px',
    border: '1px solid #4B5563', background: 'rgba(0,0,0,0.2)',
    fontFamily: 'var(--font-body)', fontSize: '1rem', color: '#fff',
    outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
    marginBottom: '1.5rem'
  };

  const labelStyle = {
    display: 'block', fontFamily: 'var(--font-body)', fontSize: '10px',
    fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase',
    color: '#9CA3AF', marginBottom: '0.5rem'
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ minHeight: '100vh', backgroundColor: '#111827', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
       <GridOverlay />
       
       <div style={{ width: '100%', maxWidth: '500px', position: 'relative', zIndex: 10, background: '#1F2937', padding: '3rem', borderRadius: '12px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>
           
           <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: '0.5rem', letterSpacing: '-1px', color: '#fff', textAlign: 'center' }}>Studio Setup</h2>
           <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: '#9CA3AF', marginBottom: '2.5rem', textAlign: 'center', lineHeight: 1.5 }}>
             Tell us about your store so customers know what to expect.
           </p>

           <form onSubmit={handleSubmit}>
              <label style={labelStyle}>Business Name</label>
              <input required value={formData.business_name} onChange={e => setFormData({...formData, business_name: e.target.value})} style={inputStyle} placeholder="e.g. Velvet Dreams Furniture" onFocus={e => e.target.style.borderColor = 'var(--color-primary)'} onBlur={e => e.target.style.borderColor = '#4B5563'} />

              <label style={labelStyle}>Store Description</label>
              <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} placeholder="Curated space vendor defining modern aesthetics..." onFocus={e => e.target.style.borderColor = 'var(--color-primary)'} onBlur={e => e.target.style.borderColor = '#4B5563'} />

              <motion.button variants={buttonTapVariants} whileHover="hover" whileTap="tap" type="submit" disabled={isLoading} style={{ width: '100%', background: 'var(--color-primary)', color: '#fff', border: 'none', padding: '1rem', borderRadius: '4px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '1rem', cursor: isLoading ? 'not-allowed' : 'pointer', transition: 'box-shadow 0.2s', boxShadow: '0 0 20px rgba(79, 70, 229, 0.4)', opacity: isLoading ? 0.5 : 1 }}>
                  {isLoading ? 'Setting up your store...' : 'Setup My Store'}
              </motion.button>
           </form>
           
       </div>
    </motion.div>
  );
}
