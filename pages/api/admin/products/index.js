// pages/api/admin/products/index.js
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
  // prefer frontend-friendly names; fallback to legacy schema fields
  name: p.name || p.title || '',
  description: p.description || p.desc || '',
  price: typeof p.price === 'number' ? p.price : Number(p.price) || 0,
  category: p.category || '',
  countInStock: typeof p.countInStock === 'number' ? p.countInStock : (p.availableQty || 0),
  image: p.image || p.img || '',
  slug: p.slug || makeSlug(p.name || p.title || ''),
  // include raw if you need entire document for debugging
  raw: undefined
});

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const products = await Product.find({});
      const normalized = products.map(normalizeProduct);
      return res.status(200).json(normalized);
    } catch (error) {
      console.error('Error fetching products:', error);
      return res.status(500).json({ error: 'Error fetching products' });
    }
  } else if (req.method === 'POST') {
    try {
      // accept frontend fields and map them to DB schema
      const {
        name,
        description,
        price,
        category,
        countInStock,
        image,
        slug // optional
      } = req.body;

      const productData = {
        // store primary schema fields expected by your mongoose model
        title: name || '',
        slug: slug || makeSlug(name || ''),
        desc: description || '',
        img: image || '',
        category: category || '',
        price: parseFloat(price) || 0,
        availableQty: parseInt(countInStock, 10) || 0
      };

      const product = new Product(productData);
      const createdProduct = await product.save();
      // return normalized object so frontend stays consistent
      return res.status(201).json(normalizeProduct(createdProduct));
    } catch (error) {
      console.error('Error creating product:', error);
      return res.status(500).json({ error: 'Error creating product' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default connectDb(handler);
