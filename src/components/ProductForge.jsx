import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { buttonTapVariants } from '../utils/motionVariants';
import { apiClient, API_BASE_URL } from '../api/apiClient';

// ─── AI Ghostwriter ───────────────────────────────────────────────────────────
// Calls POST /ai/analyze-image with the uploaded image file.
// Falls back to local template generation if the endpoint is unavailable.
const AI_TEMPLATES = [
  (t) => `Meticulously crafted ${t.toLowerCase()}, this piece bridges raw materiality with refined spatial clarity. Each surface tells a story of intentional design — a quiet assertion of architectural confidence that transforms any room into a curated experience.`,
  (t) => `The ${t} represents a convergence of organic form and industrial precision. Designed for spaces that demand both presence and restraint, it anchors the room while breathing effortlessly alongside natural light and muted palettes.`,
  (t) => `Born from the intersection of Nordic minimalism and brutalist warmth, the ${t} is a study in controlled tension. Its proportions are deliberate, its materials honest — a piece that ages with the architecture it inhabits.`,
  (t) => `Introducing the ${t}: where sculptural ambition meets domestic utility. Every angle has been calibrated to cast precise shadows, every edge softened just enough to invite touch. This is furniture as spatial punctuation.`,
];

function simulateAIDescription(title) {
  const template = AI_TEMPLATES[Math.floor(Math.random() * AI_TEMPLATES.length)];
  return template(title || 'Untitled Structure');
}

async function analyzeProductImage(imageFile, title) {
  const fd = new FormData();
  fd.append('image', imageFile);
  if (title) fd.append('title', title);
  // Direct fetch — apiClient adds Content-Type: application/json which breaks multipart
  const res = await fetch(`${API_BASE_URL}/ai/analyze-image`, {
    method: 'POST',
    body: fd,
    mode: 'cors',
  });
  if (!res.ok) throw new Error(`AI endpoint failed: ${res.status}`);
  return await res.json();
}

const CATEGORIES = ['Chairs', 'Sofas', 'Lighting', 'Interior Decor'];

export default function ProductForge({ isOpen, onClose, onProductCreated }) {
  const [form, setForm] = useState({
    title: '',
    price: '',
    category: 'Interior Decor',
    description: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageSelect = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleImageSelect(file);
  }, [handleImageSelect]);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = () => setIsDragOver(false);

  const handleGenerateDescription = async () => {
    if (!form.title.trim()) return;
    setIsGenerating(true);
    try {
      // Try real AI endpoint if an image is uploaded
      if (imageFile) {
        console.log('✦ AI Ghostwriter: Calling POST /ai/analyze-image...');
        const aiData = await analyzeProductImage(imageFile, form.title);
        const aiDesc = aiData.description || aiData.text || aiData.result;
        if (aiDesc) {
          setForm(prev => ({ ...prev, description: aiDesc }));
          setIsGenerating(false);
          return;
        }
      }
      // Fallback: local template generation
      console.log('✦ AI Ghostwriter: Using local template (no image or API unavailable).');
      await new Promise(r => setTimeout(r, 600));
      const desc = simulateAIDescription(form.title);
      setForm(prev => ({ ...prev, description: desc }));
    } catch (err) {
      console.warn('✦ AI endpoint unavailable, using local fallback:', err.message);
      const desc = simulateAIDescription(form.title);
      setForm(prev => ({ ...prev, description: desc }));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price) return;
    setIsSubmitting(true);

    // Build multipart form data matching backend expectations
    const formData = new FormData();
    formData.append('name', form.title);
    formData.append('description', form.description);
    formData.append('price', Number(form.price));
    if (imageFile) {
      formData.append('image', imageFile);
    }

    // Debug: log each entry (including binary file info)
    for (let [key, value] of formData.entries()) {
      console.log('🗂️ FormData entry:', key, value);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        body: formData,
        // Do NOT set Content-Type; browser will add multipart boundary automatically
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(`Upload failed: ${response.status} ${errBody.detail || errBody.message || response.statusText}`);
      }

      const createdProduct = await response.json();
      console.log('✅ Product created on server:', createdProduct);
      // Notify parent component of the new product
      onProductCreated(createdProduct);
    } catch (err) {
      console.error('🚨 Product upload error:', err);
      showToast(err.message || 'Failed to upload product', 'error');
    } finally {
      // Reset UI state
      setForm({ title: '', price: '', category: 'Interior Decor', description: '' });
      setImageFile(null);
      setImagePreview(null);
      setIsSubmitting(false);
      onClose();
    }
  };

  const handleClearImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
  };

  if (!isOpen) return null;

  // ─── STYLES ─────────────────────────────────────────────────────────────────
  const overlayStyle = {
    position: 'fixed', inset: 0, zIndex: 10000,
    background: 'rgba(10, 10, 15, 0.7)',
    backdropFilter: 'blur(16px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '2rem',
  };

  const panelStyle = {
    width: '100%', maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto',
    background: '#111118',
    borderRadius: '20px',
    border: '1px solid rgba(99, 102, 241, 0.2)',
    boxShadow: '0 40px 100px rgba(99, 102, 241, 0.15), 0 0 0 1px rgba(99, 102, 241, 0.08)',
    padding: '3rem',
  };

  const inputStyle = {
    width: '100%', padding: '0.85rem 1rem',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px', color: '#e2e8f0',
    fontFamily: 'var(--font-body)', fontSize: '0.95rem',
    outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  const labelStyle = {
    display: 'block', fontSize: '10px', fontWeight: 700,
    letterSpacing: '1.5px', textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.45)', marginBottom: '0.5rem',
  };

  const dropzoneStyle = {
    width: '100%', minHeight: imagePreview ? 'auto' : '180px',
    border: `2px dashed ${isDragOver ? 'rgba(99, 102, 241, 0.8)' : 'rgba(255,255,255,0.12)'}`,
    borderRadius: '14px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', transition: 'all 0.3s ease',
    background: isDragOver ? 'rgba(99, 102, 241, 0.06)' : 'rgba(255,255,255,0.02)',
    overflow: 'hidden', position: 'relative',
  };

  return (
    <AnimatePresence>
      <motion.div
        style={overlayStyle}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          style={panelStyle}
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>
                Laminar Product Forge
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.4rem' }}>
                AI-assisted spatial object creation
              </p>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: '1.5rem', cursor: 'pointer', padding: '0.5rem' }}>
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Image Dropzone */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={labelStyle}>Visual Asset</label>
              <div
                style={dropzoneStyle}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <div style={{ position: 'relative', width: '100%' }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: '12px', display: 'block' }}
                    />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleClearImage(); }}
                      style={{
                        position: 'absolute', top: '0.75rem', right: '0.75rem',
                        background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none',
                        borderRadius: '50%', width: '32px', height: '32px',
                        cursor: 'pointer', fontSize: '14px',
                        backdropFilter: 'blur(8px)',
                      }}
                    >✕</button>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', opacity: 0.3 }}>⬡</div>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem', margin: 0 }}>
                      Drop image here or <span style={{ color: 'rgba(99, 102, 241, 0.9)', fontWeight: 600 }}>browse files</span>
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                      PNG, JPG, WebP — max 10MB
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef} type="file" accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handleImageSelect(e.target.files[0])}
                />
              </div>
            </div>

            {/* Title + Price Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={labelStyle}>Title Nomenclature</label>
                <input
                  type="text" required
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Nordic Ash Dining Chair"
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              <div>
                <label style={labelStyle}>Valuation (INR)</label>
                <input
                  type="number" required min="0"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  placeholder="54000"
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* Category */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Category Routing</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                style={{
                  ...inputStyle, cursor: 'pointer', appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%236366f1' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center',
                }}
              >
                {CATEGORIES.map(c => <option key={c} value={c} style={{ background: '#1a1a2e' }}>{c}</option>)}
              </select>
            </div>

            {/* Description + AI Button */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ ...labelStyle, margin: 0 }}>Structural Blueprint</label>
                <motion.button
                  type="button"
                  onClick={handleGenerateDescription}
                  disabled={isGenerating || !form.title.trim()}
                  variants={buttonTapVariants}
                  whileHover="hover"
                  whileTap="tap"
                  style={{
                    background: isGenerating ? 'rgba(99, 102, 241, 0.15)' : 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15))',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    color: isGenerating ? 'rgba(99, 102, 241, 0.5)' : 'rgba(99, 102, 241, 0.9)',
                    padding: '0.4rem 0.85rem', borderRadius: '8px',
                    fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px',
                    textTransform: 'uppercase', cursor: isGenerating ? 'wait' : 'pointer',
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                  }}
                >
                  {isGenerating ? (
                    <><motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>⟳</motion.span> Generating...</>
                  ) : (
                    <>✦ AI Ghostwriter</>
                  )}
                </motion.button>
              </div>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Describe the spatial object, or let AI Ghostwriter generate a premium description..."
                rows={4}
                style={{
                  ...inputStyle,
                  resize: 'vertical', minHeight: '100px', lineHeight: 1.6,
                  fontFamily: 'var(--font-body)',
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <motion.button
                type="submit" disabled={isSubmitting}
                variants={buttonTapVariants} whileHover="hover" whileTap="tap"
                style={{
                  flex: 1, padding: '1rem',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: '#fff', border: 'none', borderRadius: '12px',
                  fontFamily: 'var(--font-body)', fontWeight: 700,
                  fontSize: '0.95rem', cursor: isSubmitting ? 'wait' : 'pointer',
                  boxShadow: '0 8px 30px rgba(99, 102, 241, 0.3)',
                  transition: 'opacity 0.2s',
                  opacity: isSubmitting ? 0.6 : 1,
                }}
              >
                {isSubmitting ? 'Publishing...' : 'Add to Store'}
              </motion.button>
              <motion.button
                type="button" onClick={onClose}
                variants={buttonTapVariants} whileHover="hover" whileTap="tap"
                style={{
                  padding: '1rem 1.5rem',
                  background: 'transparent',
                  color: 'rgba(255,255,255,0.4)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  fontFamily: 'var(--font-body)', fontWeight: 600,
                  fontSize: '0.95rem', cursor: 'pointer',
                }}
              >
                Abort
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
