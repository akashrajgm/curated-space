import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/apiClient';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';
import { buttonTapVariants } from '../utils/motionVariants';
import '../styles/pages.css';

export default function AccountOverview() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({});

  // Determine which endpoint to hit based on role
  const isVendor = user && String(user.role).toLowerCase() === 'vendor';
  const fetchEndpoint = isVendor ? '/vendors/profile' : '/users/me';
  const patchEndpoint = isVendor ? '/vendors/profile' : '/users/me';

  // Load existing profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        navigate('/auth');
        return;
      }
      try {
        const data = await apiClient(fetchEndpoint);
        // Normalise payload – both APIs return an object with fields we need
        setProfile({
          email: user.email,
          // User fields
          street: data.street || '',
          city: data.city || '',
          state: data.state || '',
          zip: data.zip || '',
          // Vendor fields
          business_name: data.business_name || '',
          description: data.description || '',
          website: data.website || ''
        });
      } catch (err) {
        console.error('Failed to fetch profile', err);
        showToast('Unable to load profile data.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const payload = isVendor
        ? {
            business_name: profile.business_name,
            description: profile.description,
            website: profile.website
          }
        : {
            street: profile.street,
            city: profile.city,
            state: profile.state,
            zip: profile.zip
          };
      await apiClient(patchEndpoint, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });
      showToast('Changes saved successfully.', 'success');
    } catch (err) {
      console.error('Save profile error', err);
      showToast('Failed to save changes.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="centered-spinner">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="account-overview page-container" style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem' }}>
      {/* Shared Identity Card */}
      <section className="identity-card" style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--color-surface-container-lowest)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-display)' }}>Account Overview</h2>
        <p style={{ margin: '0.5rem 0' }}>Email: {user?.email}</p>
        <button className="ghost-button" onClick={() => showToast('Password change flow not implemented yet.', 'info')} style={{ marginTop: '0.5rem' }}>
          Change Password
        </button>
      </section>

      {/* Role‑Specific Content */}
      {isVendor ? (
        <section className="vendor-card" style={{ padding: '1.5rem', background: 'var(--color-surface-container-lowest)', borderRadius: 'var(--radius-lg)' }}>
          <h3>Business Identity</h3>
          <div className="form-grid" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr' }}>
            <label>
              Business Name
              <input type="text" name="business_name" value={profile.business_name} onChange={handleChange} className="input-field" />
            </label>
            <label>
              Studio Description
              <textarea name="description" value={profile.description} onChange={handleChange} rows={3} className="input-field" />
            </label>
            <label>
              Official Website
              <input type="url" name="website" value={profile.website} onChange={handleChange} className="input-field" />
            </label>
          </div>
        </section>
      ) : (
        <section className="user-card" style={{ padding: '1.5rem', background: 'var(--color-surface-container-lowest)', borderRadius: 'var(--radius-lg)' }}>
          <h3>Address Book</h3>
          <div className="form-grid" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <label>
              Street Address
              <input type="text" name="street" value={profile.street} onChange={handleChange} className="input-field" />
            </label>
            <label>
              City
              <input type="text" name="city" value={profile.city} onChange={handleChange} className="input-field" />
            </label>
            <label>
              State
              <input type="text" name="state" value={profile.state} onChange={handleChange} className="input-field" />
            </label>
            <label>
              Zip Code
              <input type="text" name="zip" value={profile.zip} onChange={handleChange} className="input-field" />
            </label>
          </div>
        </section>
      )}

      {/* Action Buttons */}
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        <motion.button
          variants={buttonTapVariants}
          whileHover="hover"
          whileTap="tap"
          className="primary-cta"
          onClick={handleSave}
          disabled={saving}
          style={{ padding: '0.6rem 1.5rem' }}
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </motion.button>
        <button className="ghost-button" onClick={handleLogout} style={{ padding: '0.6rem 1.5rem' }}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
