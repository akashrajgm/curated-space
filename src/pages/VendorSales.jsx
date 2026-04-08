import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/apiClient';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';
import { buttonTapVariants } from '../utils/motionVariants';
import '../styles/pages.css';

export default function VendorSales() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchSales = async () => {
      setLoading(true);
      try {
        const data = await apiClient('/vendor/orders'); // GET /api/vendor/orders
        setSales(Array.isArray(data) ? data : data.items || []);
      } catch (err) {
        console.error('Failed to fetch vendor sales', err);
        showToast('Unable to load sales data.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, [user]);

  if (loading) return <p>Loading your sales...</p>;
  if (sales.length === 0) return <p>No sales recorded yet.</p>;

  return (
    <motion.div className="vendor-sales-page" variants={buttonTapVariants} initial="initial" animate="animate" exit="exit" style={{ padding: '2rem' }}>
      <h2 className="page-title">My Sales</h2>
      <div className="sales-list">
        {sales.map(order => (
          <div key={order.id} className="order-card" style={{ border: '1px solid var(--color-outline-variant)', borderRadius: 'var(--radius-lg)', padding: '1rem', marginBottom: '1rem' }}>
            <p><strong>Order #{order.id}</strong></p>
            <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
            <p>Total: {order.total ? `$${order.total}` : 'N/A'}</p>
            <p>Status: {order.status}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
