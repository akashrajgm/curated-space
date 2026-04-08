import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { apiClient } from '../api/apiClient';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const bypassActive = typeof window !== 'undefined' && localStorage.getItem('dev_bypass_active') === 'true';
    if (bypassActive) {
      setCartItems([]);
      setIsCartLoading(false);
      return;
    }
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
      setIsCartLoading(false);
    }
  }, [user]);

  const fetchCart = async () => {
    if (!user) return;
    setIsCartLoading(true);
    try {
      const data = await apiClient('/cart');
      console.log('📡 RAW SERVER CART:', data);
      const items = Array.isArray(data) ? data : data.items || [];
      const normalizedItems = items.map(item => ({
        cart_item_id: item.id || item.cart_item_id,
        // Support both snake_case and camelCase product_id keys
        id: item.product_id || item.productId || item.product?.id || item.id,
        product_id: item.product_id || item.productId || item.product?.id || item.id,
        title: item.product?.name || item.product?.title || item.title || item.name || 'Furniture Item',
        price: item.product?.price || item.price || 0,
        image: item.product?.image || item.image || '',
        quantity: item.quantity || 1,
      }));
      console.log('📦 CURRENT CART STATE:', normalizedItems);
      setCartItems(normalizedItems);
    } catch (err) {
      // ⚠️ STATE PROTECTION: On error, do NOT wipe the cart.
      // Keep current items in UI so they don't ghost away on a slow/failed server response.
      console.warn('⚠️ fetchCart failed — preserving current local cart. Error:', err.message);
    } finally {
      setIsCartLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      alert('Please sign in to add items to your cart.');
      return;
    }

    // Optimistic update so the UI responds instantly
    const existing = cartItems.find(item => item.id === product.id || item.product_id === product.id);
    if (existing) {
      setCartItems(prev =>
        prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        )
      );
    } else {
      setCartItems(prev => [...prev, { ...product, cart_item_id: `temp_${Date.now()}`, quantity }]);
    }

    try {
      await apiClient('/cart', {
        method: 'POST',
        body: JSON.stringify({ product_id: product.id, quantity }),
      });
      // ⏱ Give Tharun's DB 500ms to index the new row before re-fetching
      await new Promise(resolve => setTimeout(resolve, 500));
      await fetchCart();
    } catch (error) {
      console.error('❌ Cart POST failed:', error.message);
      // Don't rollback — the optimistic update stays so the UX doesn't flicker
    }
  };

  const removeFromCart = async (targetId) => {
    if (!user) return;
    const itemToRemove = cartItems.find(i => i.id === targetId || i.cart_item_id === targetId || i.product_id === targetId);
    if (!itemToRemove) return;

    // Optimistic slice
    setCartItems(prev => prev.filter(item => item.cart_item_id !== itemToRemove.cart_item_id));

    try {
      await apiClient(`/cart/${itemToRemove.cart_item_id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete cart item from server:', err.message);
      // Silently leave optimistic state — don't re-add the item back
    }
  };

  const updateQuantity = async (productId, newQty) => {
    setCartItems(prev =>
      prev.map(item =>
        (item.id === productId || item.product_id === productId)
          ? { ...item, quantity: newQty }
          : item
      )
    );
    // Optional: fire a PATCH if your backend supports it
    // await apiClient(`/cart/${productId}`, { method: 'PATCH', body: JSON.stringify({ quantity: newQty }) });
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const priceNum = parseFloat(String(item.price || '0').replace(/[^0-9.-]+/g, '')) || 0;
      return total + priceNum * item.quantity;
    }, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider value={{ cartItems, isCartLoading, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};
