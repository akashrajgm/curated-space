import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function ProtectedRoute({ children, reqRole, requiredRole }) {
  const { user, loading } = useAuth();

  // ─── Pre-emptive Strike: check localStorage BEFORE anything else ───
  const bypassActive = typeof window !== 'undefined' && localStorage.getItem('dev_bypass_active') === 'true';
  const bypassRole = typeof window !== 'undefined' && localStorage.getItem('dev_bypass_role');

  // If bypass is active and role matches (or no gate), let through immediately
  const gate = reqRole || requiredRole;
  if (bypassActive) {
    const effectiveRole = user?.role || bypassRole;
    if (!gate || effectiveRole === gate) return children;
  }

  if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ width: '30px', height: '30px', border: '2px solid var(--color-primary)', borderTopColor: 'transparent', borderRadius: '50%' }} /></div>;
  if (!user) return <Navigate to="/auth" />;

  if (gate && user.role !== gate) {
    if (gate === 'vendor') return <Navigate to="/" />;
    if (gate === 'user') return <Navigate to="/vendor/dashboard" />;
  }

  return children;
}
