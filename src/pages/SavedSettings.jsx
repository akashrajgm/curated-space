import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/apiClient';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';
import '../styles/pages.css';

/* ─── Reusable field components ─────────────────────────────────────────────── */
function FieldGroup({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label style={{
        fontSize: '0.7rem',
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: '#94a3b8',
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function StyledInput({ type = 'text', value, onChange, name, placeholder, disabled }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: '100%',
        padding: '0.85rem 1rem',
        fontSize: '0.95rem',
        fontFamily: 'inherit',
        color: '#0f172a',
        background: focused ? '#fff' : '#f9f9fb',
        border: `1px solid ${focused ? 'var(--color-primary)' : '#e2e8f0'}`,
        borderRadius: '10px',
        outline: 'none',
        boxShadow: focused ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none',
        transition: 'all 0.2s ease',
        boxSizing: 'border-box',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'text',
      }}
    />
  );
}

function StyledTextarea({ value, onChange, name, placeholder, rows = 3 }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: '100%',
        padding: '0.85rem 1rem',
        fontSize: '0.95rem',
        fontFamily: 'inherit',
        color: '#0f172a',
        background: focused ? '#fff' : '#f9f9fb',
        border: `1px solid ${focused ? 'var(--color-primary)' : '#e2e8f0'}`,
        borderRadius: '10px',
        outline: 'none',
        boxShadow: focused ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none',
        transition: 'all 0.2s ease',
        resize: 'vertical',
        boxSizing: 'border-box',
      }}
    />
  );
}

/* ─── Section card ────────────────────────────────────────────────────────── */
function SectionCard({ title, subtitle, children }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #f1f5f9',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{
          margin: 0,
          fontSize: '1rem',
          fontWeight: 700,
          color: '#0f172a',
          letterSpacing: '-0.02em',
        }}>{title}</h3>
        {subtitle && (
          <p style={{ margin: '0.3rem 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}

/* ─── Main Component ──────────────────────────────────────────────────────── */
export default function SavedSettings() {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [emailError, setEmailError] = useState('');

  const isVendor = user && String(user.role).toLowerCase() === 'vendor';
  const fetchEndpoint = isVendor ? '/vendors/profile' : '/users/me';
  const patchEndpoint = isVendor ? '/vendors/profile' : '/users/me';

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await apiClient(fetchEndpoint);
        setProfile({ name: user.name || '', email: user.email || '', ...data });
      } catch (err) {
        console.error('Failed to fetch profile:', err.message);
        setProfile({ name: user.name || '', email: user.email || '', address: '' });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmailError('');
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    if (!isVendor && profile.email && !profile.email.includes('@')) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setSaving(true);
    try {
      let payload;
      if (isVendor) {
        payload = {
          business_name: profile.business_name,
          description: profile.description,
          website: profile.website,
        };
      } else {
        payload = { address: profile.address || '' };
        if (profile.name) payload.name = profile.name;
        if (profile.email && profile.email.includes('@')) payload.email = profile.email;
      }
      await apiClient(patchEndpoint, { method: 'PATCH', body: JSON.stringify(payload) });
      // — Instantly sync name into Header greeting without a refresh —
      if (!isVendor && (payload.name || payload.email)) {
        updateUser({ name: payload.name, email: payload.email });
      }
      showToast('Profile saved successfully.', 'success');
    } catch (err) {
      console.error('Save error:', err.message);
      if (err.message?.includes('422')) {
        showToast('Address saved. Some fields were not accepted by the server.', 'info');
      } else {
        showToast('Failed to save profile.', 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '6rem 2rem', textAlign: 'center', color: '#94a3b8' }}>
        Loading your profile…
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        maxWidth: '800px',
        margin: '3rem auto',
        padding: '0 1.5rem 4rem',
      }}
    >
      {/* Page header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{
          fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          color: '#0f172a',
          letterSpacing: '-0.04em',
          margin: 0,
        }}>
          {isVendor ? 'Store Profile' : 'Account Settings'}
        </h2>
        <p style={{ color: '#94a3b8', marginTop: '0.5rem', fontSize: '0.95rem' }}>
          {isVendor
            ? 'Manage your business identity and storefront details.'
            : 'Update your personal information and delivery preferences.'}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {isVendor ? (
          /* ── Vendor Form ─────────────────────────────────────── */
          <>
            <SectionCard title="Business Identity" subtitle="How customers see your store">
              <div style={{ display: 'grid', gap: '1.25rem' }}>
                <FieldGroup label="Store Name">
                  <StyledInput
                    name="business_name"
                    value={profile.business_name || ''}
                    onChange={handleChange}
                    placeholder="e.g. Moderne Studio"
                  />
                </FieldGroup>
                <FieldGroup label="Website">
                  <StyledInput
                    type="url"
                    name="website"
                    value={profile.website || ''}
                    onChange={handleChange}
                    placeholder="https://yourstudio.com"
                  />
                </FieldGroup>
                <FieldGroup label="About Your Business">
                  <StyledTextarea
                    name="description"
                    value={profile.description || ''}
                    onChange={handleChange}
                    placeholder="Describe your studio's aesthetic and speciality…"
                    rows={4}
                  />
                </FieldGroup>
              </div>
            </SectionCard>
          </>
        ) : (
          /* ── Customer Form ───────────────────────────────────── */
          <>
            {/* Identity — two-column grid */}
            <SectionCard title="Personal Information" subtitle="Your name and contact details">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                <FieldGroup label="Full Name">
                  <StyledInput
                    name="name"
                    value={profile.name || ''}
                    onChange={handleChange}
                    placeholder="e.g. Akash Sharma"
                  />
                </FieldGroup>
                <FieldGroup label="Email Address">
                  <StyledInput
                    type="email"
                    name="email"
                    value={profile.email || ''}
                    onChange={handleChange}
                    placeholder="e.g. akash@studio.com"
                  />
                  {emailError && (
                    <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.25rem' }}>
                      {emailError}
                    </span>
                  )}
                </FieldGroup>
              </div>
            </SectionCard>

            {/* Address — full width */}
            <SectionCard title="Delivery Address" subtitle="Where we ship your orders">
              <FieldGroup label="Street Address">
                <StyledInput
                  name="address"
                  value={profile.address || ''}
                  onChange={handleChange}
                  placeholder="e.g. 42 Elm Street, New York, NY 10001"
                />
              </FieldGroup>
            </SectionCard>
          </>
        )}

        {/* Save button */}
        <motion.button
          whileHover={{ y: -2, boxShadow: '0 16px 32px rgba(99,102,241,0.22)' }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={saving}
          style={{
            alignSelf: 'flex-start',
            padding: '0.9rem 2.5rem',
            background: saving ? '#c7d2fe' : 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '0.95rem',
            fontWeight: 700,
            fontFamily: 'inherit',
            cursor: saving ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s',
            letterSpacing: '-0.01em',
          }}
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </motion.button>
      </div>
    </motion.div>
  );
}
