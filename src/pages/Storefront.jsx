import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useSearch } from '../context/SearchContext';
import { apiClient } from '../api/apiClient';
import { mockProducts } from '../data/mockProducts';
import { formatCurrency } from '../utils/currency';
import { pageVariants, cardHoverVariants, buttonTapVariants } from '../utils/motionVariants';
import Hero3D from '../components/Hero3D';
import ArchitecturalImage from '../components/ArchitecturalImage';
import '../styles/pages.css';

export default function Storefront() {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { searchQuery } = useSearch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);

  const categories = ['All', 'Sofas', 'Chairs', 'Lighting', 'Interior Decor'];

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await apiClient('/products');
        const mappedData = (Array.isArray(data) && data.length > 0 ? data : mockProducts).map((p, index) => ({
           id: p.id,
           title: p.name || p.title || 'Untitled Structure',
           description: p.description || 'Description unavailable.',
           price: p.price || 0,
           category: p.category || 'All',
           image: p.image || mockProducts[index % mockProducts.length]?.image || 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80'
        }));
        setProducts(mappedData);
      } catch (err) {
        setProducts(mockProducts);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => { setVisibleCount(8); }, [activeCategory, searchQuery]);

  useEffect(() => {
    const urlCategory = searchParams.get('category');
    if (urlCategory && categories.includes(urlCategory)) {
       setActiveCategory(urlCategory);
    } else if (!urlCategory) {
       setActiveCategory('All');
    }
  }, [searchParams]);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    if (cat === 'All') {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('category');
      setSearchParams(newParams);
    } else {
      setSearchParams({ category: cat });
    }
  };

  const filteredProducts = products.filter(p => {
    const passedCategory = activeCategory === 'All' || p.category === activeCategory;
    const passedSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return passedCategory && passedSearch;
  });

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
    showToast(`${product.title} curated to your cart space.`);
  };

  return (
    <motion.div className="storefront-page" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {!searchQuery && <Hero3D />}

      <section className="products-section" style={{ position: 'relative', zIndex: 5, background: 'var(--color-background)' }}>
        <div className="category-filter-bar">
          {categories.map(cat => (
             <motion.button 
               variants={buttonTapVariants} whileHover="hover" whileTap="tap"
               key={cat} 
               className={`category-toggle ${activeCategory === cat ? 'active' : ''}`}
               onClick={() => handleCategoryChange(cat)}
             >
               {cat}
             </motion.button>
          ))}
        </div>
        
        {filteredProducts.length === 0 && !isLoading && (
          <div style={{ textAlign: 'center', padding: '6rem', color: 'var(--color-on-surface-variant)', fontSize: '1.25rem' }}>
             No structural blocks resolved for that search footprint.
          </div>
        )}

        <div className="products-grid">
          <AnimatePresence>
            {isLoading ? (
              [1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                <motion.div key={`skeleton-${n}`} className="product-card skeleton-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="skeleton-image skeleton-pulse"></div>
                  <div className="skeleton-text title skeleton-pulse"></div>
                  <div className="skeleton-text desc skeleton-pulse"></div>
                  <div className="skeleton-text short skeleton-pulse" style={{ marginTop: '2rem' }}></div>
                </motion.div>
              ))
            ) : (
              filteredProducts.slice(0, visibleCount).map((product, i) => (
                <motion.div 
                   key={product.id} className="product-card" onClick={() => navigate(`/product/${product.id}`)}
                   initial={{ opacity: 0, y: 80 }} 
                   whileInView={{ opacity: 1, y: 0 }} 
                   viewport={{ once: true, margin: "-100px" }} 
                   transition={{ duration: 0.8, delay: (i % 4) * 0.1, ease: [0.76, 0, 0.24, 1] }} /* Staggered Reveal Slide-and-Fade */
                   whileHover="hover" whileTap="tap" variants={cardHoverVariants}
                >
                  <ArchitecturalImage src={product.image} alt={product.title} className="product-image-container" style={{ background: 'transparent' }} />
                  <h3>{product.title}</h3>
                  <p>{product.description}</p>
                  <div className="product-price-row">
                    <span className="price">{formatCurrency(product.price)}</span>
                    <motion.button variants={buttonTapVariants} whileHover="hover" whileTap="tap" className="primary-cta" style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem', zIndex: 10 }} onClick={(e) => handleAddToCart(e, product)}>
                      Add to Cart
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {!isLoading && visibleCount < filteredProducts.length && (
          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <motion.button variants={buttonTapVariants} whileHover="hover" whileTap="tap" className="ghost-button" onClick={() => setVisibleCount(c => c + 8)} style={{ fontSize: '1.2rem', padding: '1rem', border: '1px solid var(--color-outline-variant)', borderRadius: 'var(--radius-xl)' }}>
              Load Additional Fragments
            </motion.button>
          </div>
        )}
      </section>
    </motion.div>
  );
}
