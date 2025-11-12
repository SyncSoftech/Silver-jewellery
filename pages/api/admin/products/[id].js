// pages/api/admin/products/[id].js
import connectDb from '../../../../middleware/mongoose';
import Product from '../../../../models/Product';
import { increaseStock } from '../../../../utils/inventory';

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
  slug: p.slug || makeSlug(p.name || p.title || '')
});

const handler = async (req, res) => {
  const { method } = req;
  const { id } = req.query;

  if (method === 'GET') {
    try {
      const product = await Product.findById(id);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      return res.status(200).json(normalizeProduct(product));
    } catch (error) {
      console.error('Error fetching product:', error);
      return res.status(500).json({ error: 'Error fetching product' });
    }
  } else if (method === 'PUT') {
    try {
      const {
        name,
        title,
        description,
        desc,
        price,
        category,
        countInStock,
        availableQty,
        image,
        img,
        slug,
        size,
        color,
        addStock
      } = req.body;

      const product = await Product.findById(id);
      if (!product) return res.status(404).json({ error: 'Product not found' });

      // Handle stock addition atomically (admin adding stock)
      if (typeof addStock !== 'undefined' && addStock > 0) {
        const stockResult = await increaseStock(id, addStock);
        if (!stockResult.success) {
          return res.status(400).json({ error: stockResult.error || 'Failed to add stock' });
        }
        // Fetch updated product after stock increase
        const updatedProduct = await Product.findById(id);
        return res.status(200).json({
          success: true,
          product: normalizeProduct(updatedProduct),
          stockAdded: addStock,
          message: 'Stock added successfully'
        });
      }

      // Regular product update (non-stock fields)
      // Accept both 'name' and 'title' field names
      if (name || title) {
        product.title = (name || title).trim();
        product.slug = slug ?? makeSlug(name || title);
      }
      
      // Accept both 'description' and 'desc' field names
      if (description || desc) {
        product.desc = (description || desc).trim();
      }
      
      // Accept both 'image' and 'img' field names
      if (image || img) {
        product.img = (image || img).trim();
      }
      
      if (category) {
        product.category = category.trim();
      }
      
      if (typeof price !== 'undefined' && price !== null) {
        product.price = parseFloat(price);
      }
      
      // Accept both 'countInStock' and 'availableQty' field names
      // When updating product, ADD to existing stock instead of replacing it
      if ((typeof countInStock !== 'undefined' || typeof availableQty !== 'undefined') && typeof addStock === 'undefined') {
        const newQty = parseInt(countInStock ?? availableQty, 10);
        // Ensure non-negative stock
        if (!isNaN(newQty)) {
          // ADD the new quantity to existing stock instead of replacing it
          const currentStock = product.availableQty || 0;
          product.availableQty = Math.max(0, currentStock + newQty);
        }
      }
      
      // Update optional fields
      if (size) {
        product.size = size.trim();
      }
      if (color) {
        product.color = color.trim();
      }

      const updated = await product.save();
      return res.status(200).json({
        success: true,
        product: normalizeProduct(updated),
        message: 'Product updated successfully'
      });
    } catch (error) {
      console.error('Error updating product:', error);
      return res.status(500).json({ error: 'Error updating product' });
    }
  } else if (method === 'DELETE') {
    try {
      const product = await Product.findById(id);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      await product.remove();
      return res.status(200).json({ message: 'Product removed' });
    } catch (error) {
      console.error('Error deleting product:', error);
      return res.status(500).json({ error: 'Error deleting product' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default connectDb(handler);
