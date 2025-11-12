// utils/socket.js
import { io } from 'socket.io-client';

let socket = null;

/**
 * Initialize Socket.io connection
 * @returns {Object} socket instance
 */
export const initSocket = () => {
  if (socket) return socket;

  try {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return socket;
  } catch (error) {
    console.error('Error initializing socket:', error);
    return null;
  }
};

/**
 * Get existing socket instance or create new one
 * @returns {Object} socket instance
 */
export const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

/**
 * Emit inventory update event
 * @param {string} productId - Product ID
 * @param {number} newAvailableQty - New available quantity
 * @param {string} action - Action type: 'decrease', 'increase', 'revert'
 */
export const emitInventoryUpdate = (productId, newAvailableQty, action = 'update') => {
  const socket = getSocket();
  if (socket && socket.connected) {
    socket.emit('inventory:update', {
      productId,
      newAvailableQty,
      action,
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Listen for inventory updates
 * @param {Function} callback - Callback function to handle updates
 */
export const onInventoryUpdate = (callback) => {
  const socket = getSocket();
  if (socket) {
    socket.on('inventory:update', callback);
  }
};

/**
 * Listen for stock out of stock event
 * @param {Function} callback - Callback function
 */
export const onStockOutOfStock = (callback) => {
  const socket = getSocket();
  if (socket) {
    socket.on('inventory:outOfStock', callback);
  }
};

/**
 * Listen for stock back in stock event
 * @param {Function} callback - Callback function
 */
export const onStockBackInStock = (callback) => {
  const socket = getSocket();
  if (socket) {
    socket.on('inventory:backInStock', callback);
  }
};

/**
 * Request inventory refresh for specific product
 * @param {string} productId - Product ID
 */
export const requestInventoryRefresh = (productId) => {
  const socket = getSocket();
  if (socket && socket.connected) {
    socket.emit('inventory:refresh', { productId });
  }
};

/**
 * Listen for inventory refresh response
 * @param {Function} callback - Callback function
 */
export const onInventoryRefresh = (callback) => {
  const socket = getSocket();
  if (socket) {
    socket.on('inventory:refreshed', callback);
  }
};

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Subscribe to product inventory updates
 * @param {string} productId - Product ID
 */
export const subscribeToProduct = (productId) => {
  const socket = getSocket();
  if (socket && socket.connected) {
    socket.emit('inventory:subscribe', { productId });
  }
};

/**
 * Unsubscribe from product inventory updates
 * @param {string} productId - Product ID
 */
export const unsubscribeFromProduct = (productId) => {
  const socket = getSocket();
  if (socket && socket.connected) {
    socket.emit('inventory:unsubscribe', { productId });
  }
};
