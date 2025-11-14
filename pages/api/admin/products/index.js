// pages/api/admin/products/index.js
import connectDb from '../../../../middleware/mongoose';
import adminAuth from '../../../../middleware/adminAuth';
import Product from '../../../../models/Product';
import { verifyToken } from '../../../../utils/jwt';

const makeSlug = (text = '') =>
  String(text)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');

const normalizeProduct = (p) => ({
  _id: p._id,
  name: p.name || p.title || '',
  description: p.description || p.desc || '',
  price: typeof p.price === 'number' ? p.price : Number(p.price) || 0,
  category: p.category || '',
  countInStock: typeof p.countInStock === 'number' ? p.countInStock : (p.availableQty || 0),
  image: p.image || p.img || '',
  slug: p.slug || makeSlug(p.name || p.title || ''),
  raw: undefined
});

const handler = async (req, res) => {
  // Check admin authentication for all methods except GET
  if (req.method !== 'GET') {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }
  }

  if (req.method === 'GET') {
    try {
      const products = await Product.find({});
      return res.status(200).json(products.map(normalizeProduct));
    } catch (error) {
      console.error('Error fetching products:', error);
      return res.status(500).json({ error: 'Error fetching products' });
    }
  }

  if (req.method === 'POST') {
    try {
      // Debug: log incoming body to quickly see what client sent
      console.log('POST /api/admin/products body:', JSON.stringify(req.body || {}));

      // Accept frontend-friendly fields (be forgiving)
      const {
        name = '',
        title = '',
        description = '',
        desc = '',
        price,
        category = '',
        countInStock,
        availableQty,
        image = '',
        img = '',
        slug: incomingSlug
      } = req.body || {};

      // Prefer name/title, description/desc, image/img fields
      const finalName = (name || title || '').toString().trim();
      const finalDesc = (description || desc || '').toString().trim();
      const finalImg = (image || img || '').toString().trim();
      const finalPrice = price !== undefined && price !== null ? Number(price) : 0;
      const finalCount = countInStock !== undefined && countInStock !== null ? parseInt(countInStock, 10) : (availableQty !== undefined ? parseInt(availableQty, 10) : 0);

      // Server-side validation
      const errors = {};
      if (!finalName) errors.title = 'Title (name) is required';
      if (!incomingSlug && !finalName) errors.slug = 'Slug is required (or provide a title to auto-generate)';
      if (!finalDesc) errors.desc = 'Description is required';
      if (!finalImg) errors.img = 'Image URL is required';
      if (!category || !String(category).trim()) errors.category = 'Category is required';
      if (Number.isNaN(finalPrice) || finalPrice <= 0) errors.price = 'Valid price is required';
      if (Number.isNaN(finalCount) || finalCount < 0) errors.availableQty = 'Valid available quantity is required';

      if (Object.keys(errors).length) {
        return res.status(400).json({ success: false, errors });
      }

      const productData = {
        title: finalName,
        slug: incomingSlug?.toString().trim() || makeSlug(finalName),
        desc: finalDesc,
        img: finalImg,
        category: String(category).trim(),
        price: finalPrice,
        availableQty: finalCount
      };

      const createdProduct = await Product.create(productData);
      return res.status(201).json({ success: true, product: normalizeProduct(createdProduct) });
    } catch (error) {
      console.error('Error creating product:', error);

      // If mongoose validation error, return 400 with its messages
      if (error && error.name === 'ValidationError') {
        const mongooseErrors = Object.keys(error.errors || {}).reduce((acc, key) => {
          acc[key] = error.errors[key].message;
          return acc;
        }, {});
        return res.status(400).json({ success: false, errors: mongooseErrors });
      }

      return res.status(500).json({ success: false, message: 'Error creating product' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { title, desc, img, category, size, color, price, availableQty, productId, addStock } = req.body;

      // Check if this is a stock-only update (addStock mode)
      if (addStock !== undefined && addStock !== null) {
        if (!productId) {
          return res.status(400).json({ success: false, error: 'Product ID is required for stock update' });
        }

        const qtyToAdd = parseInt(addStock, 10);
        if (isNaN(qtyToAdd) || qtyToAdd <= 0) {
          return res.status(400).json({ success: false, error: 'Stock quantity must be greater than 0' });
        }

        // Atomically increase stock
        const updatedProduct = await Product.findByIdAndUpdate(
          productId,
          { $inc: { availableQty: qtyToAdd } },
          { new: true, runValidators: false }
        );

        if (!updatedProduct) {
          return res.status(404).json({ success: false, error: 'Product not found' });
        }

        return res.status(200).json({
          success: true,
          product: normalizeProduct(updatedProduct),
          message: `Stock increased by ${qtyToAdd}`,
          stockAdded: qtyToAdd,
          newStock: updatedProduct.availableQty
        });
      }

      // Otherwise, this is a full product update from admin panel
      // Validate required fields
      const errors = {};
      if (!title || !String(title).trim()) errors.title = 'Title is required';
      if (!desc || !String(desc).trim()) errors.desc = 'Description is required';
      if (!img || !String(img).trim()) errors.img = 'Image URL is required';
      if (!category || !String(category).trim()) errors.category = 'Category is required';
      if (price === undefined || price === null || Number.isNaN(Number(price)) || Number(price) <= 0) {
        errors.price = 'Valid price is required';
      }
      if (availableQty === undefined || availableQty === null || Number.isNaN(parseInt(availableQty, 10)) || parseInt(availableQty, 10) < 0) {
        errors.availableQty = 'Valid available quantity is required';
      }

      if (Object.keys(errors).length) {
        return res.status(400).json({ success: false, errors });
      }

      const updateData = {
        title: String(title).trim(),
        desc: String(desc).trim(),
        img: String(img).trim(),
        category: String(category).trim(),
        price: Number(price),
        availableQty: parseInt(availableQty, 10)
      };

      // Add optional fields if provided
      if (size) updateData.size = String(size).trim();
      if (color) updateData.color = String(color).trim();

      // This endpoint doesn't handle product ID in URL, so we can't update by ID
      // The admin panel should use /api/admin/products/[id] for updates
      return res.status(400).json({ 
        success: false, 
        error: 'Use PUT /api/admin/products/[id] to update existing products' 
      });
    } catch (error) {
      console.error('Error in PUT /api/admin/products:', error);
      return res.status(500).json({ success: false, error: 'Error processing request' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
};

// Apply admin auth to all non-GET requests
const withAdminAuth = (req, res) => {
  if (req.method === 'GET') {
    return handler(req, res);
  }
  return adminAuth(handler)(req, res);
};

export default connectDb(withAdminAuth);
