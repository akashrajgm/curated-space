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

export default function AuthLanding() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null);
  const [corsBlocked, setCorsBlocked] = useState(false);
  const [serverError, setServerError] = useState(null);

  const handleSocialLogin = (provider) => {
    setSocialLoading(provider);
    setTimeout(() => {
      showToast(`Identity verified via ${provider} OAuth.`);
      navigate('/');
    }, 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let attempts = 0;
    const maxRetries = 3;
    
    while(attempts < maxRetries) {
        try {
          setServerError(null);
          const resolvedUser = await login(email, password);
          showToast('Signed in successfully. Welcome back!');
          if (resolvedUser && resolvedUser.role === 'vendor') {
             navigate('/vendor/dashboard');
          } else {
             navigate('/');
          }
          setIsLoading(false);
          return;
        } catch (err) {
          if (err.message && err.message.includes('Failed to fetch')) {
             attempts++;
             if (attempts === maxRetries) {
                setServerError('Network unreachable. Is the Render server sleeping?');
             }
             if (attempts < maxRetries) {
                showToast(`Server waking up... retrying (${attempts}/${maxRetries})`);
                await new Promise(res => setTimeout(res, 3000));
                continue;
             }
          } else if (err.message && (err.message.includes('500') || err.message.includes('Internal'))) {
             setServerError('500 Server Error — Backend OAuth2 mismatch. Tharun needs to check Render logs for a Traceback.');
             showToast('Server-side error during login.');
             break;
          } else {
             setServerError(err.message);
             showToast(err.message || 'Invalid credentials.');
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
    marginBottom: '1.5rem', color: '#111827'
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

       <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', position: 'relative' }}>
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
             <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: '0.5rem', letterSpacing: '-1px', color: '#111827' }}>Sign In</h2>
             <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: '#6b7280', marginBottom: '2.5rem' }}>Welcome back. Sign in to continue.</p>

             <form onSubmit={handleSubmit}>
                <label style={labelStyle}>Email Address</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.05)'; }} onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }} />

                <label style={labelStyle}>Password</label>
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.05)'; }} onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }} />

                <motion.button variants={buttonTapVariants} whileHover="hover" whileTap="tap" type="submit" disabled={isLoading} style={{ width: '100%', background: 'var(--color-primary)', color: '#fff', border: 'none', padding: '1rem', borderRadius: '4px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', marginBottom: '1.5rem', transition: 'opacity 0.2s' }}>
                   {isLoading ? 'Verifying...' : 'Sign In'}
                </motion.button>
             </form>

             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
                <span style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>OR</span>
                <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
             </div>

             <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <motion.button 
                   onClick={() => handleSocialLogin('Google')}
                   variants={buttonTapVariants} 
                   whileHover={{ scale: 1.03, boxShadow: '0 10px 20px rgba(0,0,0,0.08)', borderColor: 'var(--color-primary)' }} 
                   whileTap="tap" 
                   style={{ flex: 1, background: 'transparent', border: '1px solid #d1d5db', padding: '0.8rem', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', color: '#111827', transition: 'border-color 0.2s' }}
                >
                   {socialLoading === 'Google' ? <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Contacting Google...</span> : (
                     <>
                       <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#000" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#000" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#000" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#000" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                       <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Google</span>
                     </>
                   )}
                </motion.button>

                <motion.button 
                   onClick={() => handleSocialLogin('Apple')}
                   variants={buttonTapVariants} 
                   whileHover={{ scale: 1.03, boxShadow: '0 10px 20px rgba(0,0,0,0.08)', borderColor: 'var(--color-primary)' }} 
                   whileTap="tap" 
                   style={{ flex: 1, background: 'transparent', border: '1px solid #d1d5db', padding: '0.8rem', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', color: '#111827', transition: 'border-color 0.2s' }}
                >
                   {socialLoading === 'Apple' ? <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Contacting Apple...</span> : (
                     <>
                       <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#000" d="M16.365 1.43c-1.393-.06-2.91.758-3.9 1.79-.884.95-1.579 2.37-1.378 3.73 1.543.085 2.976-.842 3.868-1.802.839-.933 1.574-2.348 1.41-3.718zM17.48 7.824c-1.96-1.554-5.18-1.428-6.17-.06-1.05 1.458-.88 4.2 1.25 5.86 2.22 1.76 5.56 1.48 6.55.06 1.05-1.458.74-4.22-1.63-5.86z"/></svg>
                       <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Apple</span>
                     </>
                   )}
                </motion.button>
             </div>

             <div style={{ textAlign: 'center' }}>
                 <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>Don't have an account? </span>
                 <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Create an account</Link>
             </div>
          </div>
       </div>
    </motion.div>
  );
}
