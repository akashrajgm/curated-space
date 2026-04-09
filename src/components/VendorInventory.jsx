import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient, API_BASE_URL } from '../api/apiClient';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/currency';
import { buttonTapVariants, pageVariants } from '../utils/motionVariants';
import ProductForge from './ProductForge';

export default function VendorInventory() {
  const { showToast } = useToast();
  const [inventory, setInventory] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isForgeOpen, setIsForgeOpen] = useState(false);

  useEffect(() => { fetchInventory(); }, []);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const data = await apiClient('/products');
      const apiData = Array.isArray(data) ? data : data?.data || [];
      const mappedInventory = apiData.map(p => ({
         id: p.id,
         title: p.name || p.title || 'Untitled Structure',
         description: p.description || '',
         price: p.price || 0,
         category: p.category || 'Interior Decor',
         image: p.image || ''
      }));
      setInventory(mappedInventory);
    } catch (err) {
      console.error(err);
      showToast('Inventory alignment failed.', 'error');
      setInventory([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductForged = async (product) => {
    // Multipart FormData upload — matches Tharun’s backend spec
    try {
      const fd = new FormData();
      fd.append('name', product.title);
      fd.append('description', product.description);
      fd.append('price', String(product.price));
      fd.append('category', product.category);
      if (product.imageFile) {
        fd.append('image', product.imageFile);
      }
      console.log('🚀 Uploading product via multipart/form-data...');
      // Direct fetch — apiClient forces Content-Type: application/json which breaks multipart
      const token = localStorage.getItem('jwt');
      const res = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        body: fd,
        mode: 'cors',
        ...(token && { headers: { 'Authorization': `Bearer ${token}` } }),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.detail || errBody.message || `Upload failed: ${res.status}`);
      }
      showToast('Product added to your catalog.');
      fetchInventory();
    } catch (err) {
      console.error('Product upload failed:', err.message);
      showToast(`Forge error: ${err.message}`, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Archive instance permanently?')) return;
    try {
      await apiClient(`/products/${id}`, { method: 'DELETE' });
      setInventory(prev => prev.filter(p => p.id !== id));
      showToast('Structural erasure completed.', 'success');
    } catch (err) {
      showToast('Purge rejected by API gateway.', 'error');
      fetchInventory();
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
         name: editingProduct.title,
         description: editingProduct.description,
         price: Number(editingProduct.price),
         category: editingProduct.category,
         image: editingProduct.image
      };
      await apiClient(`/products/${editingProduct.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      setInventory(prev => prev.map(p => p.id === editingProduct.id ? editingProduct : p));
      showToast('Architecture synchronized globally.');
      setEditingProduct(null);
    } catch (err) {
      showToast('PUT transaction declined.', 'error');
      fetchInventory();
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      {/* Header with Forge Trigger */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', margin: 0, fontFamily: 'var(--font-display)', letterSpacing: '-1px' }}>Live Catalog Manager</h1>
        <motion.button
          variants={buttonTapVariants} whileHover="hover" whileTap="tap"
          onClick={() => setIsForgeOpen(true)}
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff', border: 'none',
            padding: '0.8rem 1.8rem', borderRadius: '12px',
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.9rem',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}
        >
          <span style={{ fontSize: '1.1rem' }}>✦</span> Open Product Forge
        </motion.button>
      </div>

      {/* Inventory Table */}
      <div className="dashboard-card" style={{ border: '1px solid var(--color-outline-variant)' }}>
        <h2 className="section-title" style={{ fontSize: '1.35rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
           <span>Global Inventory Status</span>
           <span style={{ fontSize: '0.85rem', color: 'var(--color-on-surface-variant)', fontWeight: 400 }}>{inventory.length} active spaces mapped.</span>
        </h2>
        <div className="inventory-table-container">
          {isLoading ? <p>Synchronizing Real-Time Matrix...</p> : (
            <>
              <table className="inventory-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}><th style={{ padding: '1rem' }}>Index</th><th>Title</th><th>Category</th><th>Valuation</th><th style={{ textAlign: 'right', padding: '1rem' }}>Actions</th></tr></thead>
                <tbody>
                  <AnimatePresence>
                     {inventory.length === 0 ? <motion.tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No catalog active. Open the Product Forge to begin.</td></motion.tr> : inventory.map(item => (
                       <motion.tr key={item.id} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }} style={{ borderBottom: '1px solid #eee', cursor: 'pointer' }} whileHover={{ backgroundColor: 'rgba(59,130,246,0.02)' }}>
                         <td style={{ padding: '1rem', color: '#888', fontSize: '0.85rem' }}>#{typeof item.id === 'string' ? item.id.slice(-6) : item.id}</td>
                         <td style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 0' }}>
                            {item.image && <img loading="lazy" src={item.image} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }} />}
                            {item.title}
                            <span style={{ background: 'var(--color-primary)', color: '#fff', fontSize: '10px', padding: '3px 6px', borderRadius: '4px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', boxShadow: '0 0 10px rgba(59,130,246,0.4)' }}>LIVE</span>
                         </td>
                         <td style={{ color: '#555' }}>{item.category || "Decor"}</td>
                         <td style={{ fontWeight: 600 }}>{formatCurrency(item.price)}</td>
                         <td style={{ textAlign: 'right', padding: '1rem' }}>
                            <button onClick={() => setEditingProduct(item)} className="ghost-button" style={{ color: 'var(--color-primary)', border: '1px solid var(--color-primary)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-md)', marginRight: '0.5rem' }}>Modify</button>
                            <button onClick={() => handleDelete(item.id)} className="ghost-button" style={{ color: 'var(--color-error)', border: '1px solid rgba(255,100,100,0.3)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-md)' }}>Purge</button>
                         </td>
                       </motion.tr>
                     ))}
                  </AnimatePresence>
                </tbody>
              </table>
              <div className="mobile-card-view">
                 {inventory.length === 0 ? <p style={{ padding: '1rem', textAlign: 'center' }}>No catalog active.</p> : inventory.map(item => (
                   <div key={`mob-${item.id}`} style={{ padding: '1rem', border: '1px solid var(--color-outline-variant)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'var(--color-surface-container-lowest)' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                       {item.image && <img loading="lazy" src={item.image} alt="" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />}
                       <div style={{ flex: 1 }}>
                         <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.25rem 0' }}>{item.title}</h3>
                         <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-on-surface-variant)' }}>{item.category || "Decor"} · #{typeof item.id === 'string' ? item.id.slice(-6) : item.id}</p>
                       </div>
                       <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{formatCurrency(item.price)}</span>
                     </div>
                     <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                       <button onClick={() => setEditingProduct(item)} className="primary-cta" style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem' }}>Modify</button>
                       <button onClick={() => handleDelete(item.id)} className="ghost-button" style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem', color: 'var(--color-error)', border: '1px solid rgba(255,100,100,0.3)' }}>Purge</button>
                     </div>
                   </div>
                 ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Product Forge Modal */}
      <ProductForge
        isOpen={isForgeOpen}
        onClose={() => setIsForgeOpen(false)}
        onProductCreated={handleProductForged}
      />

      {/* Edit Modal */}
      {editingProduct && (
        <div className="modal-overlay" onClick={() => setEditingProduct(null)}>
          <motion.div className="modal-content" variants={pageVariants} initial="initial" animate="animate" onClick={e => e.stopPropagation()}>
            <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Edit Product</h2>
            <form onSubmit={handleUpdate} className="auth-form">
              <div className="form-group"><label>Product Name</label><input required type="text" value={editingProduct.title} onChange={e => setEditingProduct({...editingProduct, title: e.target.value})} style={{ padding: '0.8rem', border: '1px solid #ddd', width: '100%' }} /></div>
              <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                 <div className="form-group" style={{ flex: 1 }}><label>Base Value</label><input required type="number" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} style={{ padding: '0.8rem', border: '1px solid #ddd', width: '100%' }} /></div>
                 <div className="form-group" style={{ flex: 1 }}><label>Category Routing</label><input type="text" value={editingProduct.category || ''} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} style={{ padding: '0.8rem', border: '1px solid #ddd', width: '100%' }} /></div>
              </div>
              <div className="form-group"><label>Asset Direct Link</label><input type="url" value={editingProduct.image || ''} onChange={e => setEditingProduct({...editingProduct, image: e.target.value})} style={{ padding: '0.8rem', border: '1px solid #ddd', width: '100%' }} /></div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                 <motion.button variants={buttonTapVariants} whileHover="hover" whileTap="tap" type="submit" className="primary-cta full-width">Sign Commit</motion.button>
                 <motion.button variants={buttonTapVariants} whileHover="hover" whileTap="tap" type="button" className="ghost-button full-width" style={{ border: '1px solid #eee' }} onClick={() => setEditingProduct(null)}>Abort Transfer</motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
