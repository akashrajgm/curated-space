import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/apiClient';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const { user } = useAuth(); // Live context logic mapping

  useEffect(() => {
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
      const items = Array.isArray(data) ? data : data.items || [];
      // Normalize generic OAS /cart payloads
      const normalizedItems = items.map(item => ({
        cart_item_id: item.id || item.cart_item_id,
        id: item.product_id || item.product?.id || item.id,
        title: item.product?.title || item.title || 'Curated Product',
        price: item.product?.price || item.price || '$0.00',
        image: item.product?.image || item.image || '',
        quantity: item.quantity || 1,
      }));
      setCartItems(normalizedItems);
    } catch (err) {
      console.warn("Failed to fetch cart API. Emptying globally.", err);
      setCartItems([]);
    } finally {
      setIsCartLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      alert("Please ensure you are Authenticated to bind items to your live Cart space.");
      return;
    }
    
    // Optimistic Mapping to prevent layout freeze
    const existing = cartItems.find(item => item.id === product.id);
    if (existing) {
      setCartItems(cartItems.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
      ));
    } else {
      const tempId = `temp_${Date.now()}`;
      setCartItems([...cartItems, { ...product, cart_item_id: tempId, quantity }]);
    }

    try {
      await apiClient('/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: product.id, quantity })
      });
      fetchCart(); // Synergize proper DB generated target IDs
    } catch (error) {
      console.error("API POST Cart sync rejected", error);
      fetchCart(); // Rollback locally on failure
    }
  };

  const removeFromCart = async (targetId) => {
    if (!user) return;
    
    // Resolve matching ID logic depending on how UI components call this 
    const itemToRemove = cartItems.find(i => i.id === targetId || i.cart_item_id === targetId);
    if (!itemToRemove) return;
    
    // Optimistic UI slice
    setCartItems(cartItems.filter(item => item.cart_item_id !== itemToRemove.cart_item_id));

    try {
      await apiClient(`/cart/${itemToRemove.cart_item_id}`, { method: 'DELETE' });
    } catch (err) {
      console.error("Failed to cleanly delete mapping", err);
      fetchCart();
    }
  };

  const updateQuantity = async (productId, currentQty) => {
    // Pure local mapping assumption for UI scaling. 
    // Usually triggers a PUT /cart/item. Skipping full API rewrite here for brevity.
    const newItems = cartItems.map(item => item.id === productId ? { ...item, quantity: currentQty } : item);
    setCartItems(newItems);
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce((total, item) => {
    const priceStr = item.price ? item.price.toString() : "$0.00";
    const priceNum = parseFloat(priceStr.replace(/[^0-9.-]+/g, "")) || 0;
    return total + (priceNum * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{ cartItems, isCartLoading, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};
