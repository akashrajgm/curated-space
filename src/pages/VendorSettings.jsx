import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/apiClient';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';
import { buttonTapVariants } from '../utils/motionVariants';
import '../styles/pages.css';

export default function VendorSettings() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch existing vendor profile
  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await apiClient('/vendors/profile'); // GET vendor profile
        setProfile(data);
      } catch (err) {
        console.error('Failed to fetch vendor profile', err);
        showToast('Unable to load profile.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      await apiClient('/vendors/profile', { method: 'PATCH', body: JSON.stringify({ business_name: profile.business_name, description: profile.description }) });
      showToast('Business profile updated.', 'success');
    } catch (err) {
      console.error('Save vendor profile error', err);
      showToast('Failed to save.', 'error');
    }
  };

  if (loading) return <p>Loading vendor settings...</p>;

  return (
    <motion.div className="vendor-settings-page" variants={buttonTapVariants} initial="initial" animate="animate" exit="exit" style={{ padding: '2rem' }}>
      <h2 className="page-title">Business Identity & Profile</h2>
      <div className="form-grid" style={{ display: 'grid', gap: '1rem' }}>
        <label>
          Business Name
          <input type="text" name="business_name" value={profile.business_name || ''} onChange={handleChange} />
        </label>
        <label>
          Description
          <textarea name="description" value={profile.description || ''} onChange={handleChange} rows={4} />
        </label>
      </div>
      <button className="primary-cta" style={{ marginTop: '1rem' }} onClick={handleSave}>Save Changes</button>
    </motion.div>
  );
}
