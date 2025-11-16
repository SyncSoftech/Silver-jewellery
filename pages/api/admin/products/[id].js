// // pages/api/admin/products/[id].js
// import connectDb from '../../../../middleware/mongoose';
// import Product from '../../../../models/Product';
// import { increaseStock } from '../../../../utils/inventory';

// const makeSlug = (text = '') =>
//   String(text)
//     .toLowerCase()
//     .trim()
//     .replace(/\s+/g, '-')
//     .replace(/[^\w-]+/g, '');

// const normalizeProduct = (p) => ({
//   _id: p._id,
//   name: p.name || p.title || '',
//   description: p.description || p.desc || '',
//   price: typeof p.price === 'number' ? p.price : Number(p.price) || 0,
//   category: p.category || '',
//   countInStock: typeof p.countInStock === 'number' ? p.countInStock : (p.availableQty || 0),
//   image: p.image || p.img || '',
//   slug: p.slug || makeSlug(p.name || p.title || '')
// });

// const handler = async (req, res) => {
//   const { method } = req;
//   const { id } = req.query;

//   if (method === 'GET') {
//     try {
//       const product = await Product.findById(id);
//       if (!product) return res.status(404).json({ error: 'Product not found' });
//       return res.status(200).json(normalizeProduct(product));
//     } catch (error) {
//       console.error('Error fetching product:', error);
//       return res.status(500).json({ error: 'Error fetching product' });
//     }
//   } else if (method === 'PUT') {
//     try {
//       const {
//         name,
//         title,
//         description,
//         desc,
//         price,
//         category,
//         countInStock,
//         availableQty,
//         image,
//         img,
//         slug,
//         size,
//         color,
//         addStock
//       } = req.body;

//       const product = await Product.findById(id);
//       if (!product) return res.status(404).json({ error: 'Product not found' });

//       // Handle stock addition atomically (admin adding stock)
//       if (typeof addStock !== 'undefined' && addStock > 0) {
//         const stockResult = await increaseStock(id, addStock);
//         if (!stockResult.success) {
//           return res.status(400).json({ error: stockResult.error || 'Failed to add stock' });
//         }
//         // Fetch updated product after stock increase
//         const updatedProduct = await Product.findById(id);
//         return res.status(200).json({
//           success: true,
//           product: normalizeProduct(updatedProduct),
//           stockAdded: addStock,
//           message: 'Stock added successfully'
//         });
//       }

//       // Regular product update (non-stock fields)
//       // Accept both 'name' and 'title' field names
//       if (name || title) {
//         product.title = (name || title).trim();
//         product.slug = slug ?? makeSlug(name || title);
//       }
      
//       // Accept both 'description' and 'desc' field names
//       if (description || desc) {
//         product.desc = (description || desc).trim();
//       }
      
//       // Accept both 'image' and 'img' field names
//       if (image || img) {
//         product.img = (image || img).trim();
//       }
      
//       if (category) {
//         product.category = category.trim();
//       }
      
//       if (typeof price !== 'undefined' && price !== null) {
//         product.price = parseFloat(price);
//       }
      
//       // Accept both 'countInStock' and 'availableQty' field names
//       // When updating product, ADD to existing stock instead of replacing it
//       if ((typeof countInStock !== 'undefined' || typeof availableQty !== 'undefined') && typeof addStock === 'undefined') {
//         const newQty = parseInt(countInStock ?? availableQty, 10);
//         // Ensure non-negative stock
//         if (!isNaN(newQty)) {
//           // ADD the new quantity to existing stock instead of replacing it
//           const currentStock = product.availableQty || 0;
//           product.availableQty = Math.max(0, currentStock + newQty);
//         }
//       }
      
//       // Update optional fields
//       if (size) {
//         product.size = size.trim();
//       }
//       if (color) {
//         product.color = color.trim();
//       }

//       const updated = await product.save();
//       return res.status(200).json({
//         success: true,
//         product: normalizeProduct(updated),
//         message: 'Product updated successfully'
//       });
//     } catch (error) {
//       console.error('Error updating product:', error);
//       return res.status(500).json({ error: 'Error updating product' });
//     }
//   } else if (method === 'DELETE') {
//     try {
//       const product = await Product.findById(id);
//       if (!product) return res.status(404).json({ error: 'Product not found' });
//       await product.remove();
//       return res.status(200).json({ message: 'Product removed' });
//     } catch (error) {
//       console.error('Error deleting product:', error);
//       return res.status(500).json({ error: 'Error deleting product' });
//     }
//   } else {
//     res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
//     return res.status(405).end(`Method ${method} Not Allowed`);
//   }
// };

// export default connectDb(handler);


// // pages/api/admin/products/[id].js
// import connectDb from '../../../../middleware/mongoose';
// import Product from '../../../../models/Product';
// import { increaseStock } from '../../../../utils/inventory';

// const makeSlug = (text = '') =>
//   String(text)
//     .toLowerCase()
//     .trim()
//     .replace(/\s+/g, '-')
//     .replace(/[^\w-]+/g, '');

// const normalizeProduct = (p) => ({
//   _id: p._id,
//   name: p.name || p.title || '',
//   description: p.description || p.desc || '',
//   price: typeof p.price === 'number' ? p.price : Number(p.price) || 0,
//   category: p.category || '',
//   countInStock: typeof p.countInStock === 'number' ? p.countInStock : (p.availableQty || 0),
//   image: p.image || p.img || '',
//   images: Array.isArray(p.images) ? p.images : (p.images ? [p.images] : (p.img ? [p.img] : [])),
//   slug: p.slug || makeSlug(p.name || p.title || '')
// });

// const coerceImages = (images) => {
//   if (!images) return [];
//   if (Array.isArray(images)) return images.map(String).map(s => s.trim()).filter(Boolean);
//   if (typeof images === 'string') {
//     // try JSON parse
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

// const mergeUnique = (existing = [], incoming = []) => {
//   const set = new Set();
//   const result = [];
//   [...existing, ...incoming].forEach((u) => {
//     if (u && !set.has(u)) {
//       set.add(u);
//       result.push(u);
//     }
//   });
//   return result;
// };

// const handler = async (req, res) => {
//   const { method } = req;
//   const { id } = req.query;

//   if (method === 'GET') {
//     try {
//       const product = await Product.findById(id);
//       if (!product) return res.status(404).json({ error: 'Product not found' });
//       return res.status(200).json(normalizeProduct(product));
//     } catch (error) {
//       console.error('Error fetching product:', error);
//       return res.status(500).json({ error: 'Error fetching product' });
//     }
//   } else if (method === 'PUT') {
//     try {
//       // Accept flexible field names
//       const {
//         name,
//         title,
//         description,
//         desc,
//         price,
//         category,
//         countInStock,
//         availableQty,
//         image,   // single image URL (your upload endpoint seems to return this)
//         img,     // legacy
//         images,  // array or JSON/CSV string
//         slug,
//         size,
//         color,
//         addStock,
//         replaceImages // optional flag: if true and images provided, replace rather than merge
//       } = req.body || {};

//       const product = await Product.findById(id);
//       if (!product) return res.status(404).json({ error: 'Product not found' });

//       // Stock-only update (admin addStock)
//       if (typeof addStock !== 'undefined' && addStock > 0) {
//         const stockResult = await increaseStock(id, addStock);
//         if (!stockResult.success) {
//           return res.status(400).json({ error: stockResult.error || 'Failed to add stock' });
//         }
//         const updatedProduct = await Product.findById(id);
//         return res.status(200).json({
//           success: true,
//           product: normalizeProduct(updatedProduct),
//           stockAdded: addStock,
//           message: 'Stock added successfully'
//         });
//       }

//       // Update title/slug
//       if (name || title) {
//         product.title = (name || title).trim();
//         product.slug = slug ?? makeSlug(name || title);
//       }

//       // Description
//       if (description || desc) {
//         product.desc = (description || desc).trim();
//       }

//       // Category
//       if (category) product.category = category.trim();

//       // Price
//       if (typeof price !== 'undefined' && price !== null) {
//         const p = parseFloat(price);
//         if (!isNaN(p)) product.price = p;
//       }

//       // Stock: when admin sends availableQty / countInStock in this endpoint,
//       // we'll ADD that many units (backwards-compatible). If you want to replace stock, use dedicated endpoint.
//       if ((typeof countInStock !== 'undefined' || typeof availableQty !== 'undefined') && typeof addStock === 'undefined') {
//         const newQty = parseInt(countInStock ?? availableQty, 10);
//         if (!isNaN(newQty)) {
//           const currentStock = product.availableQty || 0;
//           product.availableQty = Math.max(0, currentStock + newQty);
//         }
//       }

//       // Size / Color
//       if (size) product.size = size.trim();
//       if (color) product.color = color.trim();

//       // Images handling:
//       // - support `images` (array or JSON/CSV string)
//       // - support single `image` or `img`
//       // - default behavior: merge incoming images with existing (no duplicates)
//       // - if replaceImages === true and incoming images provided, replace existing with incoming only
//       const incomingImages = coerceImages(images);
//       const singleImg = (image || img || '').toString().trim();
//       if (singleImg) incomingImages.push(singleImg);
//       // remove empties & dedupe incoming
//       const cleanedIncoming = Array.from(new Set(incomingImages.filter(Boolean)));

//       if (cleanedIncoming.length > 0) {
//         if (replaceImages) {
//           product.images = cleanedIncoming;
//         } else {
//           product.images = mergeUnique(product.images || [], cleanedIncoming);
//         }
//         // keep legacy img in sync with first image
//         if (product.images.length > 0) product.img = product.images[0];
//       } else if (typeof images !== 'undefined' && Array.isArray(images) && images.length === 0) {
//         // explicit empty array — admin wants to clear images
//         product.images = [];
//         product.img = product.img || '';
//       }

//       const updated = await product.save();
//       return res.status(200).json({
//         success: true,
//         product: normalizeProduct(updated),
//         message: 'Product updated successfully'
//       });
//     } catch (error) {
//       console.error('Error updating product:', error);
//       return res.status(500).json({ error: 'Error updating product' });
//     }
//   } 
//   // inside your handler for DELETE (assume connectDb() already called earlier)
// if (req.method === 'DELETE') {
//   try {
//     const { id } = req.query;
//     if (!id) {
//       return res.status(400).json({ error: 'Missing product id' });
//     }

//     // Optional: verify admin token if you use it
//     const authHeader = req.headers.authorization || '';
//     const token = authHeader.replace('Bearer ', '');
//     // verify token if necessary here...

//     // Use model-level delete to avoid deprecated document.remove()
//     const deleted = await Product.findByIdAndDelete(id);

//     if (!deleted) {
//       return res.status(404).json({ error: 'Product not found' });
//     }

//     console.log('deleted product', deleted);
//     return res.status(200).json({ success: true, product: deleted });
//   } catch (err) {
//     console.error('Error deleting product:', err);

//     // handle DNS/connection timeout specifically if it happens
//     if (err.code === 'ETIMEOUT' || (err.message && err.message.includes('querySrv'))) {
//       return res.status(503).json({
//         error: 'Database DNS lookup timeout (querySrv). Check MONGODB URI, network/DNS, or try using a direct connection string.',
//         details: err.message
//       });
//     }

//     return res.status(500).json({ error: 'Server error deleting product', details: err.message });
//   }
// }

// };

// export default connectDb(handler);


// pages/api/admin/products/[id].js
import connectDb from '../../../../middleware/mongoose';
import Product from '../../../../models/Product';
import { increaseStock } from '../../../../utils/inventory';
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
  description: p.description || p.desc || '',
  desc: p.desc || p.description || '',
  descText: p.descText || '',
  price: typeof p.price === 'number' ? p.price : Number(p.price) || 0,
  category: p.category || '',
  countInStock: typeof p.countInStock === 'number' ? p.countInStock : (p.availableQty || 0),
  image: p.image || p.img || '',
  images: Array.isArray(p.images) ? p.images : (p.images ? [p.images] : (p.img ? [p.img] : [])),
  slug: p.slug || makeSlug(p.name || p.title || '')
});

const coerceImages = (images) => {
  if (!images) return [];
  if (Array.isArray(images)) return images.map(String).map(s => s.trim()).filter(Boolean);
  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images);
      if (Array.isArray(parsed)) return parsed.map(String).map(s => s.trim()).filter(Boolean);
    } catch (e) {}
    return images.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
};

const mergeUnique = (existing = [], incoming = []) => {
  const set = new Set();
  const result = [];
  [...existing, ...incoming].forEach((u) => {
    if (u && !set.has(u)) {
      set.add(u);
      result.push(u);
    }
  });
  return result;
};

const sanitizerConfig = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
  allowedAttributes: {
    a: ['href', 'name', 'target', 'rel'],
    img: ['src', 'alt', 'width', 'height', 'style'],
    '*': ['style']
  },
  allowedSchemes: sanitizeHtml.defaults.allowedSchemes.concat(['data']),
  transformTags: {
    'a': sanitizeHtml.simpleTransform('a', { rel: 'nofollow', target: '_blank' })
  }
};

const toPlainText = (html) =>
  sanitizeHtml(html || '', { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, ' ').trim();

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
        images,
        slug,
        size,
        color,
        addStock,
        replaceImages
      } = req.body || {};

      const product = await Product.findById(id);
      if (!product) return res.status(404).json({ error: 'Product not found' });

      // Stock-only update (admin addStock)
      if (typeof addStock !== 'undefined' && Number(addStock) > 0) {
        const stockResult = await increaseStock(id, addStock);
        if (!stockResult.success) {
          return res.status(400).json({ error: stockResult.error || 'Failed to add stock' });
        }
        const updatedProduct = await Product.findById(id);
        return res.status(200).json({
          success: true,
          product: normalizeProduct(updatedProduct),
          stockAdded: addStock,
          message: 'Stock added successfully'
        });
      }

      // Update title/slug
      if (name || title) {
        product.title = (name || title).trim();
        product.slug = slug ?? makeSlug(name || title);
      }

      // Description (sanitize HTML and keep a plain-text preview)
      if (typeof description !== 'undefined' || typeof desc !== 'undefined') {
        const raw = (description || desc || '').toString();
        const safe = raw ? sanitizeHtml(raw, sanitizerConfig) : '';
        product.desc = safe;
        product.description = safe;
        product.descText = toPlainText(raw).slice(0, 1000);
      }

      // Category
      if (category) product.category = category.trim();

      // Price
      if (typeof price !== 'undefined' && price !== null) {
        const p = parseFloat(price);
        if (!isNaN(p)) product.price = p;
      }

      // Stock: add behavior (backwards-compatible)
      if ((typeof countInStock !== 'undefined' || typeof availableQty !== 'undefined') && typeof addStock === 'undefined') {
        const newQty = parseInt(countInStock ?? availableQty, 10);
        if (!isNaN(newQty)) {
          const currentStock = product.availableQty || 0;
          product.availableQty = Math.max(0, currentStock + newQty);
        }
      }

      // Size / Color
      if (size) product.size = size.trim();
      if (color) product.color = color.trim();

      // Images handling
      const incomingImages = coerceImages(images);
      const singleImg = (image || img || '').toString().trim();
      if (singleImg) incomingImages.push(singleImg);
      const cleanedIncoming = Array.from(new Set(incomingImages.filter(Boolean)));

      if (cleanedIncoming.length > 0) {
        if (replaceImages) {
          product.images = cleanedIncoming;
        } else {
          product.images = mergeUnique(product.images || [], cleanedIncoming);
        }
        if (product.images.length > 0) product.img = product.images[0];
      } else if (typeof images !== 'undefined' && Array.isArray(images) && images.length === 0) {
        // explicit clear
        product.images = [];
      }

      // save & respond
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
  }

  if (req.method === 'DELETE') {
    try {
      if (!id) {
        return res.status(400).json({ error: 'Missing product id' });
      }

      const deleted = await Product.findByIdAndDelete(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Product not found' });
      }

      console.log('deleted product', deleted);
      return res.status(200).json({ success: true, product: deleted });
    } catch (err) {
      console.error('Error deleting product:', err);
      if (err.code === 'ETIMEOUT' || (err.message && err.message.includes('querySrv'))) {
        return res.status(503).json({
          error: 'Database DNS lookup timeout (querySrv). Check MONGODB URI, network/DNS, or try using a direct connection string.',
          details: err.message
        });
      }
      return res.status(500).json({ error: 'Server error deleting product', details: err.message });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).end(`Method ${method} Not Allowed`);
};

export default connectDb(handler);
