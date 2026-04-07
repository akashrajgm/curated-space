import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/apiClient';
import { useToast } from '../context/ToastContext';
import { pageVariants, buttonTapVariants } from '../utils/motionVariants';

const GridOverlay = () => (
  <div style={{
    position: 'absolute', inset: 0,
    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
    backgroundSize: '40px 40px',
    pointerEvents: 'none',
    zIndex: 1
  }} />
);

export default function Register() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', otp: '', password: '', role: 'customer' });
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOTP = async () => {
    if (!formData.phone || formData.phone.length < 10) {
       showToast('Invalid technical phone parameter.', 'error');
       return;
    }
    showToast(`Dispatching Verification Geometry to ${formData.phone}`);
    try {
      await apiClient('/auth/send-otp', { method: 'POST', body: JSON.stringify({ phone: formData.phone }) });
    } catch(err) {
      // Intentionally suppressing API mismatches for frontend isolated demonstration
    }
    setOtpSent(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.otp.length !== 6) return;
    setIsLoading(true);
    try {
      await register(formData);
      showToast('Architectural node established.');
      navigate('/');
    } catch (err) {
      showToast('Registration parameters failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '0.8rem 1rem', borderRadius: '4px',
    border: '1px solid #d1d5db', background: 'transparent',
    fontFamily: 'var(--font-body)', fontSize: '0.95rem',
    outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
    marginBottom: '1rem', color: '#111827'
  };

  const labelStyle = {
    display: 'block', fontFamily: 'var(--font-body)', fontSize: '10px',
    fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase',
    color: '#6b7280', marginBottom: '0.5rem'
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', background: '#fff' }}>
       
       <div style={{ flex: 1, backgroundColor: 'var(--color-primary)', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '4rem' }}>
          <GridOverlay />
          <div style={{ position: 'relative', zIndex: 2 }}>
             <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: '#fff', margin: 0, letterSpacing: '1px' }}>ARCHITECT</h2>
          </div>
          <div style={{ position: 'relative', zIndex: 2 }}>
             <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', color: '#fff', lineHeight: 1.1, margin: 0, letterSpacing: '-2px' }}>
                Build your<br/>vision without<br/>borders.
             </h1>
          </div>
       </div>

       <div style={{ flex: 1, overflowY: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', position: 'relative' }}>
          
          <div style={{ position: 'absolute', top: '2rem', right: '3rem', zIndex: 10 }}>
             <button onClick={() => navigate('/')} className="ghost-button" style={{ fontSize: '1.5rem', cursor: 'pointer', border: 'none', background: 'transparent', color: '#111827' }}>✕</button>
          </div>

          <div style={{ width: '100%', maxWidth: '400px' }}>
             <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: '0.5rem', letterSpacing: '-1px', color: '#111827', marginTop: '2rem' }}>Register Node</h2>
             <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: '#6b7280', marginBottom: '2.5rem' }}>Construct a new spatial authentication identity.</p>

             <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                   <div style={{ flex: 1 }}>
                     <label style={labelStyle}>Full Name</label>
                     <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.05)'; }} onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }} />
                   </div>
                   <div style={{ flex: 1 }}>
                     <label style={labelStyle}>Context Role</label>
                     <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} style={{ ...inputStyle, cursor: 'pointer' }}>
                        <option value="customer">Customer Node</option>
                        <option value="vendor">Vendor Node</option>
                     </select>
                   </div>
                </div>

                <label style={labelStyle}>Email Address</label>
                <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={inputStyle} onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.05)'; }} onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }} />

                <label style={labelStyle}>Phone Number</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                   <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ ...inputStyle, marginBottom: 0 }} onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.05)'; }} onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }} />
                   <button type="button" onClick={handleSendOTP} disabled={otpSent} style={{ whiteSpace: 'nowrap', padding: '0 1rem', background: 'transparent', border: '1px solid var(--color-primary)', color: 'var(--color-primary)', borderRadius: '4px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', opacity: otpSent ? 0.5 : 1 }}>
                      {otpSent ? 'OTP Dispatch' : 'SEND OTP'}
                   </button>
                </div>

                <AnimatePresence>
                  {otpSent && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                      <label style={labelStyle}>6-Digit Verification Code</label>
                      <input type="text" maxLength={6} required value={formData.otp} onChange={e => setFormData({...formData, otp: e.target.value})} style={inputStyle} placeholder="------" onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.05)'; }} onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }} />
                    </motion.div>
                  )}
                </AnimatePresence>

                <label style={labelStyle}>Password</label>
                <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={inputStyle} onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.05)'; }} onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }} />

                <motion.button variants={buttonTapVariants} whileHover="hover" whileTap="tap" type="submit" disabled={isLoading || (otpSent && formData.otp.length !== 6)} style={{ width: '100%', background: 'var(--color-primary)', color: '#fff', border: 'none', padding: '1rem', borderRadius: '4px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '1rem', cursor: isLoading || (otpSent && formData.otp.length !== 6) ? 'not-allowed' : 'pointer', marginTop: '0.5rem', marginBottom: '1.5rem', opacity: isLoading || (otpSent && formData.otp.length !== 6) ? 0.5 : 1 }}>
                   {isLoading ? 'Synthesizing...' : 'Register Identity'}
                </motion.button>
             </form>

             <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>Already structured in the directory? </span>
                <Link to="/auth" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
             </div>
          </div>
       </div>

    </motion.div>
  );
}
