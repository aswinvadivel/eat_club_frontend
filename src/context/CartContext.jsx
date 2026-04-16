import React, { createContext, useEffect, useState } from 'react';
import { cartAPI } from '../services/api';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize cart on mount
  useEffect(() => {
    const initializeCart = async () => {
      try {
        setLoading(true);
        const response = await cartAPI.getCart();
        setCart(response.data);
      } catch (err) {
        // Cart might not exist yet, that's okay
        setCart(null);
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      initializeCart();
    }
  }, []);

  const addToCart = async (itemId, restaurantId, quantity, specialInstructions = '') => {
    try {
      setError(null);
      
      // If cart exists and it's from a different restaurant, prevent
      if (cart?.restaurantId && cart.restaurantId !== restaurantId) {
        throw new Error('You can only order from one restaurant at a time. Clear your cart to switch restaurants.');
      }

      // Initialize cart if doesn't exist
      if (!cart) {
        await cartAPI.initialize();
      }

      const response = await cartAPI.addItem({
        itemId,
        restaurantId,
        quantity,
        specialInstructions,
      });

      // Refresh cart
      await refreshCart();
      return response.data;
    } catch (err) {
      const errorMsg = err.message || err.response?.data?.message || 'Failed to add item';
      setError(errorMsg);
      throw err;
    }
  };

  const updateCartItem = async (cartItemId, quantity, specialInstructions = '') => {
    try {
      setError(null);
      const response = await cartAPI.updateItem(cartItemId, {
        quantity,
        specialInstructions,
      });
      await refreshCart();
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update item';
      setError(errorMsg);
      throw err;
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      setError(null);
      await cartAPI.removeItem(cartItemId);
      await refreshCart();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to remove item';
      setError(errorMsg);
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      setError(null);
      await cartAPI.clearCart();
      setCart(null);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to clear cart';
      setError(errorMsg);
      throw err;
    }
  };

  const refreshCart = async () => {
    try {
      const response = await cartAPI.getCart();
      setCart(response.data);
    } catch (err) {
      setCart(null);
    }
  };

  const value = {
    cart,
    cartItems: cart?.cartItems || [],
    loading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart,
    cartItemsCount: (cart?.cartItems || []).reduce((sum, item) => sum + (item.quantity || 0), 0),
    cartTotal: cart?.total || 0,
    currentRestaurantId: cart?.restaurantId || null,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
