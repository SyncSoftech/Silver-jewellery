// pages/api/socket.js
import { Server } from 'socket.io';
import Product from '../../models/Product';

// Store connected clients and their subscriptions
const subscriptions = new Map(); // productId -> Set of socket ids

const handler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket.io already attached');
    res.end();
    return;
  }

  const io = new Server(res.socket.server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || '*',
      methods: ['GET', 'POST']
    }
  });

  res.socket.server.io = io;

  io.on('connection', (socket) => {
    console.log('New socket connection:', socket.id);

    // Subscribe to product inventory updates
    socket.on('inventory:subscribe', ({ productId }) => {
      if (!subscriptions.has(productId)) {
        subscriptions.set(productId, new Set());
      }
      subscriptions.get(productId).add(socket.id);
      console.log(`Socket ${socket.id} subscribed to product ${productId}`);
    });

    // Unsubscribe from product inventory updates
    socket.on('inventory:unsubscribe', ({ productId }) => {
      if (subscriptions.has(productId)) {
        subscriptions.get(productId).delete(socket.id);
        if (subscriptions.get(productId).size === 0) {
          subscriptions.delete(productId);
        }
      }
      console.log(`Socket ${socket.id} unsubscribed from product ${productId}`);
    });

    // Request inventory refresh for specific product
    socket.on('inventory:refresh', async ({ productId }) => {
      try {
        const product = await Product.findById(productId).select('_id title availableQty');
        if (product) {
          socket.emit('inventory:refreshed', {
            productId: product._id,
            title: product.title,
            availableQty: product.availableQty || 0,
            inStock: (product.availableQty || 0) > 0,
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Error refreshing inventory:', error);
        socket.emit('error', { message: 'Failed to refresh inventory' });
      }
    });

    // Handle inventory update from server/API
    socket.on('inventory:update', ({ productId, newAvailableQty, action }) => {
      // Broadcast to all subscribed clients
      if (subscriptions.has(productId)) {
        const subscribers = subscriptions.get(productId);
        subscribers.forEach(socketId => {
          io.to(socketId).emit('inventory:updated', {
            productId,
            newAvailableQty,
            action,
            inStock: newAvailableQty > 0,
            timestamp: new Date().toISOString()
          });
        });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
      // Clean up subscriptions
      subscriptions.forEach((subscribers, productId) => {
        subscribers.delete(socket.id);
        if (subscribers.size === 0) {
          subscriptions.delete(productId);
        }
      });
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  res.end();
};

export default handler;
