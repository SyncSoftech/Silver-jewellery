// pages/api/inventory/stock.js
import connectDB from '../../../middleware/mongoose';
import Product from '../../../models/Product';
import { validateStockAvailability, getProductStock } from '../../../utils/inventory';

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'GET') {
    try {
      const { productId, productIds } = req.query;

      // Get stock for single product
      if (productId) {
        const product = await Product.findById(productId).select('_id title availableQty price');
        if (!product) {
          return res.status(404).json({ error: 'Product not found' });
        }
        return res.status(200).json({
          productId: product._id,
          title: product.title,
          availableQty: product.availableQty || 0,
          inStock: (product.availableQty || 0) > 0,
          price: product.price
        });
      }

      // Get stock for multiple products
      if (productIds) {
        const ids = Array.isArray(productIds) ? productIds : [productIds];
        const products = await Product.find({ _id: { $in: ids } }).select('_id title availableQty price');
        
        const stockData = products.map(p => ({
          productId: p._id,
          title: p.title,
          availableQty: p.availableQty || 0,
          inStock: (p.availableQty || 0) > 0,
          price: p.price
        }));

        return res.status(200).json(stockData);
      }

      return res.status(400).json({ error: 'productId or productIds required' });
    } catch (error) {
      console.error('Error fetching stock:', error);
      return res.status(500).json({ error: 'Error fetching stock' });
    }
  }

  if (method === 'POST') {
    try {
      const { action, cartItems } = req.body;

      if (!action || !cartItems) {
        return res.status(400).json({ error: 'action and cartItems required' });
      }

      if (action === 'validate') {
        // Validate stock for cart items
        const validation = await validateStockAvailability(cartItems);
        return res.status(validation.valid ? 200 : 409).json(validation);
      }

      return res.status(400).json({ error: 'Invalid action' });
    } catch (error) {
      console.error('Error in inventory stock API:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${method} Not Allowed`);
};

export default connectDB(handler);
