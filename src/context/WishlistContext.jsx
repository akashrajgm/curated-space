import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '../api/apiClient';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setWishlist([]);
      setLoading(false);
      return;
    }
    fetchWishlist();
  }, [user]);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const data = await apiClient('/wishlist');
      console.log('💜 RAW SERVER WISHLIST:', data);
      const items = Array.isArray(data) ? data : data.items || [];
      setWishlist(items);
    } catch (err) {
      // ⚠️ STATE PROTECTION: don't clear wishlist on a failed fetch
      console.error('❌ Wishlist Fetch Failed:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (product) => {
    if (!user) {
      showToast('Please sign in to manage your wishlist.', 'info');
      return;
    }
    const isInWishlist = (wishlist || []).some(
      item => item.id === product.id || item.product_id === product.id
    );

    // Optimistic update
    if (isInWishlist) {
      setWishlist(prev => prev.filter(
        item => !(item.id === product.id || item.product_id === product.id)
      ));
    } else {
      setWishlist(prev => [...prev, product]);
    }

    try {
      if (isInWishlist) {
        await apiClient(`/wishlist/${product.id}`, { method: 'DELETE' });
        showToast('Removed from wishlist.', 'success');
      } else {
        await apiClient('/wishlist', {
          method: 'POST',
          body: JSON.stringify({ product_id: product.id }),
        });
        showToast('Added to wishlist.', 'success');
      }
    } catch (err) {
      console.error('❌ Wishlist Sync Failed:', err.message);
      // Revert the optimistic update on error
      if (isInWishlist) {
        setWishlist(prev => [...prev, product]);
      } else {
        setWishlist(prev => prev.filter(
          item => !(item.id === product.id || item.product_id === product.id)
        ));
      }
      showToast('Unable to update wishlist.', 'error');
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist: wishlist || [], loading, toggleWishlist, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
