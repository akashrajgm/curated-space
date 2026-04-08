import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/apiClient';
import { formatCurrency } from '../utils/currency';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants, buttonTapVariants } from '../utils/motionVariants';
import '../styles/pages.css';

export default function MyOrders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiClient('/orders');
        console.log('📜 RAW SERVER ORDERS:', data);

        // Normalize: backend may return array or { orders: [], items: [] }
        const rawList = Array.isArray(data)
          ? data
          : data.orders || data.items || data.data || [];

        const normalized = rawList.map(order => ({
          id: order.id || order.order_id,
          status: order.status || 'Processing',
          total: order.total || order.total_amount || order.amount || 0,
          created_at: order.created_at || order.createdAt || order.date || null,
          address: order.address || order.shipping_address || '—',
          // Handle both order_items and orderItems
          items: order.order_items || order.orderItems || order.items || [],
        }));

        console.log('📦 NORMALIZED ORDERS:', normalized);
        setOrders(normalized);
      } catch (err) {
        console.error('❌ Failed to fetch orders:', err.message);
        // Only show error state for real failures, not empty results
        if (!err.message?.includes('404')) {
          setError(err.message);
        }
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-on-surface-variant)' }}>Sign in to view your orders.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-on-surface-variant)' }}>Loading order history...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="orders-page"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ padding: '2rem' }}
    >
      <h2 className="page-title" style={{ marginBottom: '2rem' }}>My Orders</h2>

      {error && (
        <div style={{
          padding: '1rem 1.5rem',
          background: 'rgba(var(--color-error-rgb, 220,38,38), 0.08)',
          border: '1px solid var(--color-error)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          fontSize: '0.9rem',
          color: 'var(--color-error)',
        }}>
          ⚠️ Could not load orders from server: {error}
        </div>
      )}

      {orders.length === 0 && !error ? (
        <div style={{ textAlign: 'center', padding: '6rem 2rem', color: 'var(--color-on-surface-variant)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
          <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>No orders yet.</p>
          <motion.button
            variants={buttonTapVariants} whileHover="hover" whileTap="tap"
            className="primary-cta"
            onClick={() => navigate('/')}
          >
            Start Shopping
          </motion.button>
        </div>
      ) : (
        <div className="orders-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <AnimatePresence>
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                style={{
                  border: '1px solid var(--color-outline-variant)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  background: 'var(--color-surface-container-lowest)',
                }}
              >
                {/* Order header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-on-surface)' }}>
                      Order #{String(order.id).slice(-8).toUpperCase()}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-on-surface-variant)', marginTop: '0.2rem' }}>
                      {order.created_at
                        ? new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                        : 'Date unavailable'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {/* Status badge */}
                    <span style={{
                      padding: '0.3rem 0.75rem',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      background: order.status?.toLowerCase() === 'delivered'
                        ? 'rgba(34,197,94,0.12)' : 'rgba(var(--color-primary-rgb, 99,102,241), 0.12)',
                      color: order.status?.toLowerCase() === 'delivered'
                        ? '#16a34a' : 'var(--color-primary)',
                    }}>
                      {order.status}
                    </span>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-primary)' }}>
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>

                {/* Delivery address */}
                {order.address && order.address !== '—' && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-on-surface-variant)', marginBottom: '1rem' }}>
                    📍 {order.address}
                  </p>
                )}

                {/* Order items */}
                {order.items.length > 0 && (
                  <div style={{ borderTop: '1px solid var(--color-surface-variant)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--color-on-surface-variant)' }}>
                        <span>{item.product?.name || item.title || item.name || `Item ${idx + 1}`} × {item.quantity || 1}</span>
                        <span>{formatCurrency((item.price || item.unit_price || 0) * (item.quantity || 1))}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
