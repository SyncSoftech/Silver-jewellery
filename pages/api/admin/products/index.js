// // pages/api/admin/products/index.js
// import connectDb from '../../../../middleware/mongoose';
// import Product from '../../../../models/Product';

// const makeSlug = (text = '') =>
//   String(text)
//     .toLowerCase()
//     .trim()
//     .replace(/\s+/g, '-')
//     .replace(/[^\w-]+/g, '');

// const normalizeProduct = (p) => ({
//   _id: p._id,
//   name: p.name || p.title || '',
//   title: p.title || p.name || '',
//   description: p.description || p.desc || '',
//   desc: p.desc || p.description || '',
//   price: typeof p.price === 'number' ? p.price : Number(p.price) || 0,
//   category: p.category || '',
//   countInStock: typeof p.countInStock === 'number' ? p.countInStock : (p.availableQty || 0),
//   availableQty: p.availableQty !== undefined ? p.availableQty : (p.countInStock || 0),
//   image: p.image || p.img || '',
//   img: p.img || p.image || '',
//   images: Array.isArray(p.images) ? p.images : (p.images ? [p.images] : (p.img ? [p.img] : [])),
//   size: p.size || '',
//   color: p.color || '',
//   slug: p.slug || makeSlug(p.name || p.title || ''),
//   createdAt: p.createdAt,
//   updatedAt: p.updatedAt
// });

// const coerceImages = (images) => {
//   if (!images) return [];
//   if (Array.isArray(images)) return images.map(String).map(s => s.trim()).filter(Boolean);
//   if (typeof images === 'string') {
//     // try JSON parse (client may send JSON-stringified array)
//     try {
//       const parsed = JSON.parse(images);
//       if (Array.isArray(parsed)) return parsed.map(String).map(s => s.trim()).filter(Boolean);
//     } catch (e) {
//       // not JSON
//     }
//     // CSV fallback
//     return images.split(',').map(s => s.trim()).filter(Boolean);
//   }
//   return [];
// };

// const handler = async (req, res) => {
//   const { method } = req;

//   if (method === 'GET') {
//     try {
//       // Optionally support simple query filters in future (category, q, etc.)
//       const products = await Product.find({}).sort({ createdAt: -1 }).lean();
//       return res.status(200).json(products.map(normalizeProduct));
//     } catch (error) {
//       console.error('Error listing products:', error);
//       return res.status(500).json({ success: false, error: 'Error fetching products' });
//     }
//   }

//   if (method === 'POST') {
//     try {
//       // Accept flexible input
//       const {
//         name,
//         title,
//         description,
//         desc,
//         price,
//         category,
//         countInStock,
//         availableQty,
//         image,   // single image URL
//         img,     // legacy
//         images,  // array or string
//         slug,
//         size,
//         color
//       } = req.body || {};

//       // Normalize fields
//       const finalTitle = (title || name || '').toString().trim();
//       const finalDesc = (description || desc || '').toString().trim();
//       const finalCategory = category !== undefined && category !== null ? String(category).trim() : '';
//       const finalPrice = (price !== undefined && price !== null && price !== '') ? Number(price) : NaN;
//       const finalQty = parseInt(availableQty ?? countInStock ?? '0', 10);

//       // Build images list: coerce incoming plus single image fallback
//       const incoming = coerceImages(images);
//       const singleImg = (image || img || '').toString().trim();
//       if (singleImg) incoming.unshift(singleImg); // prefer single image if provided
//       const imagesArray = Array.from(new Set(incoming.filter(Boolean))); // dedupe

//       // Primary image — prefer provided single image or first of imagesArray
//       const primaryImg = singleImg || (imagesArray.length ? imagesArray[0] : '');

//       // Validation
//       const errors = {};
//       if (!finalTitle) errors.title = 'Title is required';
//       if (!finalDesc) errors.desc = 'Description is required';
//       if (!primaryImg) errors.img = 'Primary image (image or img or images) is required';
//       if (!finalCategory) errors.category = 'Category is required';
//       if (Number.isNaN(finalPrice) || finalPrice <= 0) errors.price = 'Valid price is required';
//       if (Number.isNaN(finalQty) || finalQty < 0) errors.availableQty = 'Valid available quantity is required';

//       if (Object.keys(errors).length) {
//         return res.status(400).json({ success: false, errors });
//       }

//       const slugValue = slug && String(slug).trim() ? String(slug).trim() : makeSlug(finalTitle);

//       const productData = {
//         title: finalTitle,
//         desc: finalDesc,
//         category: finalCategory,
//         price: Number(finalPrice),
//         availableQty: Number.isFinite(finalQty) ? finalQty : 0,
//         img: primaryImg,
//         images: imagesArray,
//         size: size ? String(size).trim() : undefined,
//         color: color ? String(color).trim() : undefined,
//         slug: slugValue
//       };

//       // Debug log (remove in production if noisy)
//       console.log('Creating product with data:', JSON.stringify(productData));

//       const created = await Product.create(productData);
//       return res.status(201).json({ success: true, product: normalizeProduct(created) });
//     } catch (error) {
//       console.error('Error creating product:', error);
//       if (error && error.name === 'ValidationError') {
//         const mongooseErrors = Object.keys(error.errors || {}).reduce((acc, key) => {
//           acc[key] = error.errors[key].message;
//           return acc;
//         }, {});
//         return res.status(400).json({ success: false, errors: mongooseErrors });
//       }
//       return res.status(500).json({ success: false, error: 'Error creating product' });
//     }
//   }

//   res.setHeader('Allow', ['GET', 'POST']);
//   return res.status(405).end(`Method ${method} Not Allowed`);
// };

// export default connectDb(handler);


// pages/api/admin/products/index.js
import connectDb from '../../../../middleware/mongoose';
import Product from '../../../../models/Product';
import sanitizeHtml from 'sanitize-html';

const makeSlug = (text = '') =>
  String(text)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');

const normalizeProduct = (p) => ({
  _id: p._id,
  name: p.name || p.title || '',
  title: p.title || p.name || '',
  description: p.description || p.desc || '',
  desc: p.desc || p.description || '',
  descText: p.descText || '',
  price: typeof p.price === 'number' ? p.price : Number(p.price) || 0,
  category: p.category || '',
  countInStock: typeof p.countInStock === 'number' ? p.countInStock : (p.availableQty || 0),
  availableQty: p.availableQty !== undefined ? p.availableQty : (p.countInStock || 0),
  image: p.image || p.img || '',
  img: p.img || p.image || '',
  images: Array.isArray(p.images) ? p.images : (p.images ? [p.images] : (p.img ? [p.img] : [])),
  size: p.size || '',
  color: p.color || '',
  slug: p.slug || makeSlug(p.name || p.title || ''),
  createdAt: p.createdAt,
  updatedAt: p.updatedAt
});

const coerceImages = (images) => {
  if (!images) return [];
  if (Array.isArray(images)) return images.map(String).map(s => s.trim()).filter(Boolean);
  if (typeof images === 'string') {
    // try JSON parse (client may send JSON-stringified array)
    try {
      const parsed = JSON.parse(images);
      if (Array.isArray(parsed)) return parsed.map(String).map(s => s.trim()).filter(Boolean);
    } catch (e) {
      // not JSON
    }
    // CSV fallback
    return images.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
};

// Sanitizer configuration: allow common formatting, links and images
const sanitizerConfig = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
  allowedAttributes: {
    a: ['href', 'name', 'target', 'rel'],
    img: ['src', 'alt', 'width', 'height', 'style'],
    '*': ['style'] // careful: style allowed, but you may remove if undesired
  },
  allowedSchemes: sanitizeHtml.defaults.allowedSchemes.concat(['data']), // allow data: for pasted base64 images (optional)
  transformTags: {
    'a': sanitizeHtml.simpleTransform('a', { rel: 'nofollow', target: '_blank' })
  }
};

// produce plain text preview
const toPlainText = (html) =>
  sanitizeHtml(html || '', { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, ' ').trim();

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'GET') {
    try {
      const products = await Product.find({}).sort({ createdAt: -1 }).lean();
      return res.status(200).json(products.map(normalizeProduct));
    } catch (error) {
      console.error('Error listing products:', error);
      return res.status(500).json({ success: false, error: 'Error fetching products' });
    }
  }

  if (method === 'POST') {
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
        images,
        slug,
        size,
        color
      } = req.body || {};

      const finalTitle = (title || name || '').toString().trim();
      const finalDescRaw = (description || desc || '').toString().trim();
      const finalCategory = category !== undefined && category !== null ? String(category).trim() : '';
      const finalPrice = (price !== undefined && price !== null && price !== '') ? Number(price) : NaN;
      const finalQty = parseInt(availableQty ?? countInStock ?? '0', 10);

      const incoming = coerceImages(images);
      const singleImg = (image || img || '').toString().trim();
      if (singleImg) incoming.unshift(singleImg);
      const imagesArray = Array.from(new Set(incoming.filter(Boolean)));

      const primaryImg = singleImg || (imagesArray.length ? imagesArray[0] : '');

      // sanitize description (allow limited tags/images/links)
      const safeDesc = finalDescRaw ? sanitizeHtml(finalDescRaw, sanitizerConfig) : '';
      const descText = toPlainText(finalDescRaw).slice(0, 1000); // store up to 1000 chars preview

      // Validation
      const errors = {};
      if (!finalTitle) errors.title = 'Title is required';
      if (!safeDesc || toPlainText(safeDesc).length === 0) errors.desc = 'Description is required';
      if (!primaryImg) errors.img = 'Primary image (image or img or images) is required';
      if (!finalCategory) errors.category = 'Category is required';
      if (Number.isNaN(finalPrice) || finalPrice <= 0) errors.price = 'Valid price is required';
      if (Number.isNaN(finalQty) || finalQty < 0) errors.availableQty = 'Valid available quantity is required';

      if (Object.keys(errors).length) {
        return res.status(400).json({ success: false, errors });
      }

      const slugValue = slug && String(slug).trim() ? String(slug).trim() : makeSlug(finalTitle);

      const productData = {
        title: finalTitle,
        desc: safeDesc,
        description: safeDesc,
        descText,
        category: finalCategory,
        price: Number(finalPrice),
        availableQty: Number.isFinite(finalQty) ? finalQty : 0,
        img: primaryImg,
        image: primaryImg,
        images: imagesArray,
        size: size ? String(size).trim() : undefined,
        color: color ? String(color).trim() : undefined,
        slug: slugValue
      };

      console.log('Creating product with data:', JSON.stringify({
        ...productData,
        // avoid logging very large descHtml; show snippet
        descSnippet: productData.descText && productData.descText.slice(0, 200)
      }));

      const created = await Product.create(productData);
      return res.status(201).json({ success: true, product: normalizeProduct(created) });
    } catch (error) {
      console.error('Error creating product:', error);
      if (error && error.name === 'ValidationError') {
        const mongooseErrors = Object.keys(error.errors || {}).reduce((acc, key) => {
          acc[key] = error.errors[key].message;
          return acc;
        }, {});
        return res.status(400).json({ success: false, errors: mongooseErrors });
      }
      return res.status(500).json({ success: false, error: 'Error creating product' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${method} Not Allowed`);
};

export default connectDb(handler);
