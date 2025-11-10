// pages/api/admin/products/[id].js
import connectDb from '../../../../middleware/mongoose';
import Product from '../../../../models/Product';

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
        description,
        price,
        category,
        countInStock,
        image,
        slug
      } = req.body;

      const product = await Product.findById(id);
      if (!product) return res.status(404).json({ error: 'Product not found' });

      // write back to your DB schema fields
      product.title = name ?? product.title;
      product.slug = slug ?? makeSlug(name ?? product.title);
      product.desc = description ?? product.desc;
      product.img = image ?? product.img;
      product.category = category ?? product.category;
      product.price = typeof price !== 'undefined' ? parseFloat(price) : product.price;
      product.availableQty = typeof countInStock !== 'undefined' ? parseInt(countInStock, 10) : product.availableQty;

      const updated = await product.save();
      return res.status(200).json(normalizeProduct(updated));
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
