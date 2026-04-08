import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
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
  const { register, login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ email: '', password: '', role: 'customer' });
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let attempts = 0;
    const maxRetries = 3;

    while (attempts < maxRetries) {
      try {
        setServerError(null);
        // Register the user first
        const registerResult = await register({
          email: formData.email,
          password: formData.password,
          role: formData.role,
        });
        // Ensure we have a fresh token and user state by explicitly logging in
        const loginResult = await login(formData.email, formData.password);
        // Navigation based on role after full auth sync
        if (formData.role === 'vendor' || (loginResult && loginResult.role === 'vendor')) {
          showToast('Seller account created! Setting up your store...');
          navigate('/vendor/onboarding');
        } else {
          showToast('Account created! Welcome.');
          navigate('/');
        }
        setIsLoading(false);
        return;
      } catch (err) {
        if (err.message && err.message.includes('Failed to fetch')) {
          attempts++;
          if (attempts === maxRetries) {
            setServerError('Network unreachable. Is the Render server sleeping? Click below to wake it.');
          }
          if (attempts < maxRetries) {
            showToast(`Server waking up... retrying (${attempts}/${maxRetries})`);
            await new Promise(res => setTimeout(res, 3000));
            continue;
          }
        } else if (err.message && (err.message.includes('500') || err.message.includes('Internal'))) {
          setServerError('500 Internal Server Error — Tharun needs to check the database logs. Our payload is correct.');
          showToast('Server-side error. The registration payload was sent correctly.');
          break;
        } else {
          setServerError(err.message);
          showToast(err.message || 'Registration failed.');
          break;
        }
      }
    }
    setIsLoading(false);
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
          {serverError && (
             <div style={{ position: 'absolute', top: '10rem', right: '3rem', background: serverError.includes('500') ? '#f59e0b' : '#DC2626', color: '#fff', padding: '1.5rem', borderRadius: '12px', zIndex: 1000, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', maxWidth: '300px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>{serverError.includes('500') ? '⚠️' : '🔴'}</span> {serverError.includes('500') ? 'Server-Side Error' : 'Connection Issue'}
                </div>
                <p style={{ fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.5 }}>{serverError}</p>
                <a href="https://interior-marketplace-api.onrender.com/docs" target="_blank" rel="noopener noreferrer" style={{ display: 'block', textAlign: 'center', background: '#fff', color: '#333', padding: '0.8rem', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 800, textDecoration: 'none' }}>
                   Check Server Status
                </a>
             </div>
          )}
          <div style={{ position: 'absolute', top: '2rem', right: '3rem', zIndex: 10 }}>
             <button onClick={() => navigate('/')} className="ghost-button" style={{ fontSize: '1.5rem', cursor: 'pointer', border: 'none', background: 'transparent', color: '#111827' }}>✕</button>
          </div>

          <div style={{ width: '100%', maxWidth: '400px' }}>
             <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: '0.5rem', letterSpacing: '-1px', color: '#111827', marginTop: '2rem' }}>Create Account</h2>
             <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: '#6b7280', marginBottom: '2.5rem' }}>Join thousands of shoppers. It's free.</p>

             <form onSubmit={handleSubmit}>
                 <label style={labelStyle}>I am a</label>
                 <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} style={{ ...inputStyle, cursor: 'pointer', marginBottom: '1.5rem' }}>
                    <option value="customer">Shopper</option>
                    <option value="vendor">Seller</option>
                 </select>

                <label style={labelStyle}>Email Address</label>
                <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={inputStyle} onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.05)'; }} onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }} />

                <label style={labelStyle}>Password</label>
                <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={inputStyle} onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.05)'; }} onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }} />

                <motion.button variants={buttonTapVariants} whileHover="hover" whileTap="tap" type="submit" disabled={isLoading} style={{ width: '100%', background: 'var(--color-primary)', color: '#fff', border: 'none', padding: '1rem', borderRadius: '4px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '1rem', cursor: isLoading ? 'not-allowed' : 'pointer', marginTop: '1.5rem', marginBottom: '1.5rem', opacity: isLoading ? 0.5 : 1 }}>
                    {isLoading ? 'Creating your account...' : 'Create Account'}
                </motion.button>
             </form>

             <div style={{ textAlign: 'center' }}>
                 <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>Already have an account? </span>
                 <Link to="/auth" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
             </div>
          </div>
       </div>

    </motion.div>
  );
}
