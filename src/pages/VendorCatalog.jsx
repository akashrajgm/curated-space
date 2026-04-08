import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/apiClient';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';
import { buttonTapVariants } from '../utils/motionVariants';
import '../styles/pages.css';

export default function VendorCatalog() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await apiClient('/vendor/products'); // GET vendor inventory
        setProducts(Array.isArray(data) ? data : data.items || []);
      } catch (err) {
        console.error('Failed to fetch vendor catalog', err);
        showToast('Unable to load catalog.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [user]);

  if (loading) return <p>Loading catalog...</p>;
  if (products.length === 0) return <p>No products in inventory.</p>;

  return (
    <motion.div className="vendor-catalog-page" variants={buttonTapVariants} initial="initial" animate="animate" exit="exit" style={{ padding: '2rem' }}>
      <h2 className="page-title">My Products</h2>
      <div className="product-grid" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
        {products.map(prod => (
          <div key={prod.id} className="product-card" style={{ border: '1px solid var(--color-outline-variant)', borderRadius: 'var(--radius-lg)', padding: '1rem' }}>
            <p><strong>{prod.title || prod.name}</strong></p>
            <p>Price: {prod.price ? `$${prod.price}` : 'N/A'}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
