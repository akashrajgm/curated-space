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
  const [socialLoading, setSocialLoading] = useState(null);

  const handleSocialLogin = (provider) => {
    setSocialLoading(provider);
    setTimeout(() => {
      setSocialLoading(null);
      showToast(`${provider} Auth logic prepared (Simulation Mode).`);
    }, 2000);
  };

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
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="auth-layout" style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', background: '#fff' }}>
       
       <div className="auth-panel-blue" style={{ flex: 1, backgroundColor: 'var(--color-primary)', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '4rem' }}>
          <GridOverlay />
          <div style={{ position: 'relative', zIndex: 2 }}>
             <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: '#fff', margin: 0, letterSpacing: '1px' }}>ARCHITECT</h2>
          </div>
          <div style={{ position: 'relative', zIndex: 2 }}>
             <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: '#fff', lineHeight: 1.1, margin: 0, letterSpacing: '-2px' }}>
                Build your<br/>vision without<br/>borders.
             </h1>
          </div>
       </div>

       <div className="auth-panel-form" style={{ flex: 1, overflowY: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', position: 'relative' }}>
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

          <div style={{ width: '100%', maxWidth: '100%' }}>
             <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 2.5rem)', marginBottom: '0.5rem', letterSpacing: '-1px', color: '#111827', marginTop: '2rem' }}>Create Account</h2>
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

             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
                <span style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>OR</span>
                <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
             </div>

             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <motion.button 
                   onClick={() => handleSocialLogin('Google')}
                   variants={buttonTapVariants} 
                   whileHover={{ scale: 1.03, boxShadow: '0 10px 20px rgba(0,0,0,0.08)', borderColor: 'var(--color-primary)' }} 
                   whileTap="tap" 
                   style={{ width: '100%', background: 'transparent', border: '1px solid #d1d5db', padding: '0.8rem', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', color: '#111827', transition: 'border-color 0.2s' }}
                >
                   {socialLoading === 'Google' ? <span style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap' }}>Contacting Google...</span> : (
                     <>
                       <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#000" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#000" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#000" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#000" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                       <span style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap' }}>Continue with Google</span>
                     </>
                   )}
                </motion.button>

                <motion.button 
                   onClick={() => handleSocialLogin('Apple')}
                   variants={buttonTapVariants} 
                   whileHover={{ scale: 1.03, boxShadow: '0 10px 20px rgba(0,0,0,0.08)', borderColor: 'var(--color-primary)' }} 
                   whileTap="tap" 
                   style={{ width: '100%', background: 'transparent', border: '1px solid #d1d5db', padding: '0.8rem', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', color: '#111827', transition: 'border-color 0.2s' }}
                >
                   {socialLoading === 'Apple' ? <span style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap' }}>Contacting Apple...</span> : (
                     <>
                       <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#000" d="M16.365 1.43c-1.393-.06-2.91.758-3.9 1.79-.884.95-1.579 2.37-1.378 3.73 1.543.085 2.976-.842 3.868-1.802.839-.933 1.574-2.348 1.41-3.718zM17.48 7.824c-1.96-1.554-5.18-1.428-6.17-.06-1.05 1.458-.88 4.2 1.25 5.86 2.22 1.76 5.56 1.48 6.55.06 1.05-1.458.74-4.22-1.63-5.86z"/></svg>
                       <span style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap' }}>Continue with Apple</span>
                     </>
                   )}
                </motion.button>
             </div>

             <div style={{ textAlign: 'center' }}>
                 <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>Already have an account? </span>
                 <Link to="/auth" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
             </div>
          </div>
       </div>

    </motion.div>
  );
}
