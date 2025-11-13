import Product from "@/models/Product";
import connectDb from "@/middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const { 
        q,                    // Search query
        category,             // Filter by category
        minPrice,             // Minimum price
        maxPrice,             // Maximum price
        inStock,              // Filter in-stock items (true/false)
        sortBy,               // Sort field: price, title, createdAt
        order,                // Sort order: asc, desc
        page = 1,             // Pagination: page number
        limit = 10            // Results per page
      } = req.query;

      // Build search query
      const searchQuery = {};

      // Text search across multiple fields
      if (q && q.trim()) {
        searchQuery.$or = [
          { title: { $regex: q, $options: 'i' } },
          { desc: { $regex: q, $options: 'i' } },
          { category: { $regex: q, $options: 'i' } },
        ];
      }

      // Category filter
      if (category) {
        searchQuery.category = { $regex: category, $options: 'i' };
      }

      // Price range filter
      if (minPrice || maxPrice) {
        searchQuery.price = {};
        if (minPrice) searchQuery.price.$gte = parseFloat(minPrice);
        if (maxPrice) searchQuery.price.$lte = parseFloat(maxPrice);
      }

      // Stock availability filter
      if (inStock === 'true') {
        searchQuery.availableQty = { $gt: 0 };
      } else if (inStock === 'false') {
        searchQuery.availableQty = { $lte: 0 };
      }

      // Build sort object
      const sortOptions = {};
      if (sortBy) {
        const sortField = sortBy === 'price' ? 'price' 
                        : sortBy === 'title' ? 'title'
                        : sortBy === 'createdAt' ? 'createdAt'
                        : 'createdAt'; // default
        
        sortOptions[sortField] = order === 'desc' ? -1 : 1;
      } else {
        // Default sort by relevance (newest first)
        sortOptions.createdAt = -1;
      }

      // Pagination
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 10;
      const skip = (pageNum - 1) * limitNum;

      // Execute search with filters, sorting, and pagination
      const [products, totalCount] = await Promise.all([
        Product.find(searchQuery)
          .sort(sortOptions)
          .skip(skip)
          .limit(limitNum)
          .lean(),
        Product.countDocuments(searchQuery)
      ]);
      
      // Format results
      const results = products.map(product => ({
        id: product._id,
        title: product.title,
        slug: product.slug,
        img: product.img,
        price: product.price,
        category: product.category,
        availableQty: product.availableQty,
        desc: product.desc ? product.desc.substring(0, 100) + '...' : ''
      }));

      // Calculate pagination info
      const totalPages = Math.ceil(totalCount / limitNum);
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;

      res.status(200).json({ 
        results,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalResults: totalCount,
          resultsPerPage: limitNum,
          hasNextPage,
          hasPrevPage
        },
        filters: {
          query: q || '',
          category: category || '',
          priceRange: {
            min: minPrice || null,
            max: maxPrice || null
          },
          inStock: inStock || 'all',
          sortBy: sortBy || 'createdAt',
          order: order || 'asc'
        }
      });
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