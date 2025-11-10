import Product from "@/models/Product";
import connectDb from "@/middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const { q } = req.query;
      
      if (!q) {
        return res.status(200).json({ results: [] });
      }

      // Search in title, desc, and category fields (case insensitive)
      const searchQuery = {
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { desc: { $regex: q, $options: 'i' } },
          { category: { $regex: q, $options: 'i' } },
        ],
        availableQty: { $gt: 0 } // Only show in-stock items
      };

      const products = await Product.find(searchQuery).limit(10);
      
      // Format results to include necessary fields
      const results = products.map(product => ({
        id: product._id,
        title: product.title,
        slug: product.slug,
        img: product.img,
        price: product.price,
        category: product.category,
        availableQty: product.availableQty
      }));

      res.status(200).json({ results });
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: 'Error performing search' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default connectDb(handler);