// utils/inventory.js
import Product from '../models/Product';

/**
 * Validate if sufficient stock is available for all items in cart
 * @param {Array} cartItems - Array of {productId, quantity}
 * @returns {Promise<{valid: boolean, errors: Array, products: Array}>}
 */
export const validateStockAvailability = async (cartItems) => {
  try {
    const errors = [];
    const products = [];

    // Handle empty cart
    if (!cartItems || cartItems.length === 0) {
      return {
        valid: false,
        errors: [{ message: 'Cart is empty' }],
        products: []
      };
    }

    for (const item of cartItems) {
      // Extract product ID from various possible field names
      const productId = item.productId || item._id || item.product;
      
      if (!productId) {
        errors.push({
          message: 'Product ID not found in cart item',
          item
        });
        continue;
      }

      // Extract quantity from various possible field names
      let requestedQty = parseInt(item.qty || item.quantity || item.count || 1, 10);
      
      // Validate quantity
      if (isNaN(requestedQty) || requestedQty <= 0) {
        requestedQty = 1;
      }

      try {
        // Try to find by ObjectId first, then by slug if that fails
        let product;
        try {
          product = await Product.findById(productId);
        } catch (err) {
          // If findById fails (invalid ObjectId), try finding by slug
          if (err.name === 'CastError') {
            product = await Product.findOne({ slug: productId });
          } else {
            throw err;
          }
        }
        
        if (!product) {
          errors.push({
            productId,
            message: 'Product not found'
          });
          continue;
        }

        const availableQty = product.availableQty || 0;

        console.log(`Stock check - Product: ${product.title}, Available: ${availableQty}, Requested: ${requestedQty}`);

        if (availableQty < requestedQty) {
          errors.push({
            productId: product._id,
            productName: product.title,
            requested: requestedQty,
            available: availableQty,
            message: `Insufficient stock. Available: ${availableQty}, Requested: ${requestedQty}`
          });
        } else {
          products.push({
            _id: product._id,
            title: product.title,
            availableQty,
            requestedQty
          });
        }
      } catch (err) {
        console.error(`Error checking stock for product ${productId}:`, err);
        errors.push({
          productId,
          message: `Error checking stock: ${err.message}`
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      products
    };
  } catch (error) {
    console.error('Error validating stock:', error);
    throw new Error('Stock validation failed: ' + error.message);
  }
};

/**
 * Atomically decrease stock for multiple products
 * Uses MongoDB findOneAndUpdate with $inc operator to ensure atomicity
 * @param {Array} cartItems - Array of {productId, quantity}
 * @returns {Promise<{success: boolean, updated: Array, failed: Array}>}
 */
export const decreaseStock = async (cartItems) => {
  try {
    const updated = [];
    const failed = [];

    for (const item of cartItems) {
      const productId = item.productId || item._id;
      const qtyToDecrease = parseInt(item.qty || item.quantity || 1, 10);

      try {
        // Atomic operation: decrease stock only if available >= requested
        const result = await Product.findOneAndUpdate(
          {
            _id: productId,
            availableQty: { $gte: qtyToDecrease } // Check: available >= requested
          },
          {
            $inc: { availableQty: -qtyToDecrease } // Atomic decrease
          },
          { new: true, runValidators: false }
        );

        if (!result) {
          // Stock check failed - insufficient inventory
          const product = await Product.findById(productId);
          failed.push({
            productId,
            message: 'Insufficient stock for this item',
            availableQty: product?.availableQty || 0,
            requestedQty: qtyToDecrease
          });
        } else {
          updated.push({
            productId: result._id,
            title: result.title,
            newAvailableQty: result.availableQty,
            decreasedBy: qtyToDecrease
          });
        }
      } catch (err) {
        failed.push({
          productId,
          message: 'Error updating stock: ' + err.message
        });
      }
    }

    return {
      success: failed.length === 0,
      updated,
      failed
    };
  } catch (error) {
    console.error('Error decreasing stock:', error);
    throw new Error('Stock decrease operation failed: ' + error.message);
  }
};

/**
 * Atomically increase stock for a product (admin adding stock)
 * @param {string} productId - Product ID
 * @param {number} quantityToAdd - Quantity to add
 * @returns {Promise<{success: boolean, product: Object}>}
 */
export const increaseStock = async (productId, quantityToAdd) => {
  try {
    const qtyToAdd = parseInt(quantityToAdd, 10);

    if (qtyToAdd <= 0) {
      throw new Error('Quantity to add must be greater than 0');
    }

    // Atomic operation: increase stock
    const result = await Product.findByIdAndUpdate(
      productId,
      {
        $inc: { availableQty: qtyToAdd }
      },
      { new: true, runValidators: false }
    );

    if (!result) {
      throw new Error('Product not found');
    }

    return {
      success: true,
      product: {
        _id: result._id,
        title: result.title,
        newAvailableQty: result.availableQty,
        increasedBy: qtyToAdd
      }
    };
  } catch (error) {
    console.error('Error increasing stock:', error);
    throw new Error('Stock increase operation failed: ' + error.message);
  }
};

/**
 * Revert stock decrease (in case of payment failure or order cancellation)
 * @param {Array} cartItems - Array of {productId, quantity}
 * @returns {Promise<{success: boolean, reverted: Array, failed: Array}>}
 */
export const revertStockDecrease = async (cartItems) => {
  try {
    const reverted = [];
    const failed = [];

    for (const item of cartItems) {
      const productId = item.productId || item._id;
      const qtyToRevert = parseInt(item.qty || item.quantity || 1, 10);

      try {
        const result = await Product.findByIdAndUpdate(
          productId,
          {
            $inc: { availableQty: qtyToRevert } // Add back the quantity
          },
          { new: true, runValidators: false }
        );

        if (result) {
          reverted.push({
            productId: result._id,
            title: result.title,
            newAvailableQty: result.availableQty,
            revertedBy: qtyToRevert
          });
        } else {
          failed.push({
            productId,
            message: 'Product not found for revert'
          });
        }
      } catch (err) {
        failed.push({
          productId,
          message: 'Error reverting stock: ' + err.message
        });
      }
    }

    return {
      success: failed.length === 0,
      reverted,
      failed
    };
  } catch (error) {
    console.error('Error reverting stock:', error);
    throw new Error('Stock revert operation failed: ' + error.message);
  }
};

/**
 * Get current stock for a product
 * @param {string} productId - Product ID
 * @returns {Promise<number>}
 */
export const getProductStock = async (productId) => {
  try {
    const product = await Product.findById(productId).select('availableQty');
    return product?.availableQty || 0;
  } catch (error) {
    console.error('Error getting product stock:', error);
    return 0;
  }
};

/**
 * Prevent negative stock - ensure availableQty never goes below 0
 * @param {string} productId - Product ID
 * @returns {Promise<{success: boolean, product: Object}>}
 */
export const ensureNonNegativeStock = async (productId) => {
  try {
    const result = await Product.findByIdAndUpdate(
      productId,
      {
        $max: { availableQty: 0 } // Set to 0 if negative
      },
      { new: true, runValidators: false }
    );

    return {
      success: !!result,
      product: result
    };
  } catch (error) {
    console.error('Error ensuring non-negative stock:', error);
    throw new Error('Failed to ensure non-negative stock: ' + error.message);
  }
};
