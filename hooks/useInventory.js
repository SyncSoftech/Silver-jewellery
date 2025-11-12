// hooks/useInventory.js
import { useEffect, useState, useCallback } from 'react';
import { 
  initSocket, 
  onInventoryUpdate, 
  subscribeToProduct, 
  unsubscribeFromProduct,
  requestInventoryRefresh 
} from '../utils/socket';

/**
 * Hook to manage real-time inventory updates for products
 * @param {Array<string>} productIds - Array of product IDs to monitor
 * @returns {Object} - inventory state and methods
 */
export const useInventory = (productIds = []) => {
  const [inventory, setInventory] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize socket and subscribe to products
  useEffect(() => {
    if (!productIds || productIds.length === 0) return;

    try {
      initSocket();
      
      // Subscribe to each product
      productIds.forEach(productId => {
        subscribeToProduct(productId);
      });

      // Listen for inventory updates
      onInventoryUpdate(({ productId, newAvailableQty, action, inStock }) => {
        setInventory(prev => ({
          ...prev,
          [productId]: {
            availableQty: newAvailableQty,
            inStock,
            action,
            lastUpdated: new Date().toISOString()
          }
        }));
      });

      // Cleanup on unmount
      return () => {
        productIds.forEach(productId => {
          unsubscribeFromProduct(productId);
        });
      };
    } catch (err) {
      console.error('Error setting up inventory listener:', err);
      setError(err.message);
    }
  }, [productIds]);

  // Fetch initial stock for products
  const fetchStock = useCallback(async (ids = productIds) => {
    if (!ids || ids.length === 0) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/inventory/stock?productIds=${ids.join(',')}`
      );
      if (!response.ok) throw new Error('Failed to fetch stock');
      
      const data = await response.json();
      const stockMap = {};
      data.forEach(item => {
        stockMap[item.productId] = {
          availableQty: item.availableQty,
          inStock: item.inStock,
          title: item.title
        };
      });
      setInventory(stockMap);
      setError(null);
    } catch (err) {
      console.error('Error fetching stock:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [productIds]);

  // Refresh stock for a specific product
  const refreshProduct = useCallback((productId) => {
    requestInventoryRefresh(productId);
  }, []);

  // Check if product is in stock
  const isInStock = useCallback((productId) => {
    return inventory[productId]?.inStock ?? false;
  }, [inventory]);

  // Get available quantity for product
  const getAvailableQty = useCallback((productId) => {
    return inventory[productId]?.availableQty ?? 0;
  }, [inventory]);

  return {
    inventory,
    loading,
    error,
    fetchStock,
    refreshProduct,
    isInStock,
    getAvailableQty
  };
};

/**
 * Hook to validate cart stock before checkout
 * @param {Object} cart - Cart object with items
 * @returns {Object} - validation state and methods
 */
export const useCartStockValidation = (cart = {}) => {
  const [validation, setValidation] = useState({
    valid: true,
    errors: [],
    loading: false
  });

  const validateCart = useCallback(async () => {
    setValidation(prev => ({ ...prev, loading: true }));
    
    try {
      const cartItems = Object.values(cart).map(item => ({
        productId: item._id || item.productId,
        qty: item.qty || item.quantity || 1
      }));

      if (cartItems.length === 0) {
        setValidation({
          valid: false,
          errors: [{ message: 'Cart is empty' }],
          loading: false
        });
        return false;
      }

      const response = await fetch('/api/inventory/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'validate',
          cartItems
        })
      });

      const result = await response.json();
      
      setValidation({
        valid: result.valid,
        errors: result.errors || [],
        loading: false
      });

      return result.valid;
    } catch (err) {
      console.error('Error validating cart stock:', err);
      setValidation({
        valid: false,
        errors: [{ message: err.message }],
        loading: false
      });
      return false;
    }
  }, [cart]);

  return {
    ...validation,
    validateCart
  };
};
