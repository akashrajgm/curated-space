import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/currency';
import { pageVariants, buttonTapVariants } from '../utils/motionVariants';
import '../styles/pages.css';

export default function VendorDashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [profileNeedsSetup, setProfileNeedsSetup] = useState(false);
  const [vendorDetails, setVendorDetails] = useState({ company_name: '', address: '' });
  
  const [inventory, setInventory] = useState([]);
  const [newProduct, setNewProduct] = useState({ title: '', description: '', price: '', category: 'Interior Decor', image: '' });
  
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    checkProfileAndFetch();
  }, [user]);

  const checkProfileAndFetch = async () => {
    setIsLoading(true);
    try {
      const data = await apiClient('/products');
      const apiData = Array.isArray(data) ? data : data.data || [];
      // Map API payload translating generic 'name' keys strictly into Architectural schema
      const mappedInventory = apiData.map(p => ({
         id: p.id,
         title: p.name || p.title || 'Untitled Structure',
         description: p.description || '',
         price: p.price || 0,
         category: p.category || 'Interior Decor',
         image: p.image || ''
      }));
      setInventory(mappedInventory);

      if (user && Object.keys(user).length > 0 && user.needs_vendor_profile) {
         setProfileNeedsSetup(true);
      }
    } catch (err) {
      if (err.message && err.message.includes('404')) setProfileNeedsSetup(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSetup = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiClient('/vendors/profile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(vendorDetails) });
      showToast('Vendor Profile successfully synchronized.');
      setProfileNeedsSetup(false);
    } catch (err) {
      showToast('Synchronization failed. Verify data payload.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.price) return showToast('Title and Numeric parameters absolute.');
    
    setIsSubmitting(true);
    try {
      // Map correctly to Render Backend Payload formatting 'title' back into 'name'
      const payload = {
         name: newProduct.title,
         description: newProduct.description,
         price: Number(newProduct.price),
         category: newProduct.category,
         image: newProduct.image
      };
      
      await apiClient('/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      showToast('Architectural piece deployed to global catalog.');
      setNewProduct({ title: '', description: '', price: '', category: 'Interior Decor', image: '' });
      checkProfileAndFetch();
    } catch (err) {
      showToast('API POST Operation blocked.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Perform structural archive? This clears API data entirely.")) return;
    try {
      await apiClient(`/products/${id}`, { method: 'DELETE' });
      setInventory(prev => prev.filter(p => p.id !== id));
      showToast('Product erased and de-indexed.');
    } catch (err) {
      showToast('Purge rejected entirely by API gateway.');
      checkProfileAndFetch();
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
      showToast('Core details dynamically updated across grid.');
      setEditingProduct(null);
    } catch (err) {
      showToast('API PUT Transaction corrupted.');
      checkProfileAndFetch();
    }
  };

  if (profileNeedsSetup) {
    return (
      <motion.div className="auth-container" variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <div className="auth-card" style={{ maxWidth: '600px' }}>
           <div className="auth-header"><h2>Initialize Workspace</h2><p>Register your studio</p></div>
           <form onSubmit={handleProfileSetup} className="auth-form">
              <div className="form-group"><label>Company Title</label><input required type="text" value={vendorDetails.company_name} onChange={e => setVendorDetails({...vendorDetails, company_name: e.target.value})} /></div>
              <div className="form-group"><label>Address</label><input required type="text" value={vendorDetails.address} onChange={e => setVendorDetails({...vendorDetails, address: e.target.value})} /></div>
              <motion.button variants={buttonTapVariants} whileHover="hover" whileTap="tap" disabled={isSubmitting} type="submit" className="primary-cta full-width">Establish Identity</motion.button>
           </form>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div className="dashboard-page" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <header style={{ marginBottom: '3rem' }}>
        <h1 className="page-title" style={{ marginBottom: '0.5rem' }}>Vendor Operations</h1>
        <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '1.1rem', fontFamily: 'var(--font-body)' }}>Manage your data strictly.</p>
      </header>
      
      <div className="dashboard-layout">
        <div>
           <div className="dashboard-card">
              <h2 className="section-title" style={{ fontSize: '1.35rem', marginBottom: '1.5rem' }}>Add Product</h2>
              <form className="auth-form" onSubmit={handleAddProduct}>
                <div className="form-group"><label>Product Title</label><input type="text" value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} required /></div>
                <div className="form-row">
                   <div className="form-group half"><label>Calculated Numeric Price</label><input type="text" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} placeholder="35000" required /></div>
                   <div className="form-group half"><label>Category</label><select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="ghost-select"><option value="Sofas">Sofas</option><option value="Chairs">Chairs</option><option value="Lighting">Lighting</option><option value="Interior Decor">Interior Decor</option></select></div>
                </div>
                <div className="form-group"><label>Description</label><input type="text" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} /></div>
                <div className="form-group"><label>Image Asset URL</label><input type="url" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} /></div>
                <motion.button variants={buttonTapVariants} whileHover="hover" whileTap="tap" type="submit" className="primary-cta" disabled={isSubmitting} style={{ marginTop: '1rem' }}>Deploy to Grid</motion.button>
              </form>
           </div>
           
           <div className="dashboard-card" style={{ marginTop: '3rem' }}>
              <h2 className="section-title" style={{ fontSize: '1.35rem', marginBottom: '1.5rem' }}>Vendor Settings</h2>
              <form className="auth-form" onSubmit={handleProfileSetup}>
                 <div className="form-group"><label>Company Title</label><input required type="text" value={vendorDetails.company_name} onChange={e => setVendorDetails({...vendorDetails, company_name: e.target.value})} /></div>
                 <div className="form-group"><label>Address</label><input required type="text" value={vendorDetails.address} onChange={e => setVendorDetails({...vendorDetails, address: e.target.value})} /></div>
                 <motion.button variants={buttonTapVariants} whileHover="hover" whileTap="tap" disabled={isSubmitting} type="submit" className="ghost-button" style={{ marginTop: '1rem', border: '1px solid var(--color-outline-variant)', padding: '0.8rem', borderRadius: 'var(--radius-xl)' }}>Sync Profile Setup</motion.button>
              </form>
           </div>
        </div>

        <div className="dashboard-card">
          <h2 className="section-title" style={{ fontSize: '1.35rem', marginBottom: '1.5rem' }}>Inventory Status</h2>
          <div className="inventory-table-container">
            {isLoading ? <p>Synchronizing Database...</p> : (
              <table className="inventory-table">
                <thead><tr><th>UUID</th><th>Category</th><th>Title & Scale</th><th>Financials</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
                <tbody>
                  <AnimatePresence>
                     {inventory.length === 0 ? <motion.tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No catalog active.</td></motion.tr> : inventory.map(item => (
                       <motion.tr key={item.id} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}>
                         <td className="item-id">{item.id}</td><td>{item.category || "Decor"}</td><td className="item-title">{item.title}</td>
                         <td style={{ fontWeight: 600 }}>{formatCurrency(item.price)}</td>
                         <td style={{ textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button onClick={() => setEditingProduct(item)} className="ghost-button" style={{ color: 'var(--color-primary)', background: 'var(--color-primary-container)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)' }}>Modifier</button>
                            <button onClick={() => handleDelete(item.id)} className="ghost-button" style={{ color: 'var(--color-error)', background: 'rgba(255,100,100,0.1)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)' }}>Purge</button>
                         </td>
                       </motion.tr>
                     ))}
                  </AnimatePresence>
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {editingProduct && (
        <div className="modal-overlay" onClick={() => setEditingProduct(null)}>
          <motion.div className="modal-content" variants={pageVariants} initial="initial" animate="animate" onClick={e => e.stopPropagation()}>
            <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Modify Form</h2>
            <form onSubmit={handleUpdate} className="auth-form">
              <div className="form-group"><label>Title Overwrite</label><input required type="text" value={editingProduct.title} onChange={e => setEditingProduct({...editingProduct, title: e.target.value})} /></div>
              <div className="form-row">
                 <div className="form-group half"><label>Numeric Price</label><input required type="number" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} /></div>
                 <div className="form-group half"><label>Category</label><input type="text" value={editingProduct.category || ''} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} /></div>
              </div>
              <div className="form-group"><label>Asset Replacement (URL)</label><input type="url" value={editingProduct.image || ''} onChange={e => setEditingProduct({...editingProduct, image: e.target.value})} /></div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                 <motion.button variants={buttonTapVariants} whileHover="hover" whileTap="tap" type="submit" className="primary-cta full-width">Sign & Update</motion.button>
                 <motion.button variants={buttonTapVariants} whileHover="hover" whileTap="tap" type="button" className="ghost-button full-width" onClick={() => setEditingProduct(null)}>Abort</motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
