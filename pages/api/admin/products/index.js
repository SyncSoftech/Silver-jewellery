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

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
};

export default connectDb(handler);
