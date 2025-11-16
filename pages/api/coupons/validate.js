// pages/api/coupons/validate.js (or your chosen path)
// POST only: { code, cartTotal, items, userId? }

import dbConnect from '../../../middleware/mongoose';
import Coupon from '../../../models/Coupon';
import Order from '../../../models/Order'; // used only if userId is provided

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { code, cartTotal, items = [], userId } = req.body;

  if (!code || cartTotal === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Coupon code and cart total are required'
    });
  }

  try {
    await dbConnect();

    const now = new Date();

    // Find active coupon
    const coupon = await Coupon.findOne({
      code: String(code).trim().toUpperCase(),
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
      $or: [
        { usageLimit: null },
        { $expr: { $lt: ['$usedCount', '$usageLimit'] } }
      ]
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Invalid or expired coupon code'
      });
    }

    // Check minimum order amount (default 0)
    const minOrder = coupon.minOrderAmount || 0;
    if (cartTotal < minOrder) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of ₹${minOrder} required to apply this coupon`
      });
    }

    // Check applicability to cart items (if coupon limits to products/categories)
    if ((coupon.applicableProducts?.length || 0) > 0 || (coupon.applicableCategories?.length || 0) > 0) {
      // items should be [{ product: { _id, category, ... }, qty, price }, ...]
      const isApplicable = items.some(item => {
        const product = item.product || {};
        const prodId = product._id ? String(product._id) : null;
        const prodCats = Array.isArray(product.category) ? product.category.map(String) : (product.category ? [String(product.category)] : []);

        const productMatch = !coupon.applicableProducts?.length ||
          coupon.applicableProducts.some(id => String(id) === prodId);

        const categoryMatch = !coupon.applicableCategories?.length ||
          coupon.applicableCategories.some(catId => prodCats.includes(String(catId)));

        return productMatch || categoryMatch;
      });

      if (!isApplicable) {
        return res.status(400).json({
          success: false,
          message: 'This coupon is not applicable to items in your cart'
        });
      }
    }

    // Per-user limit: only enforce if userId is provided in request
    if (coupon.perUserLimit && userId) {
      const userCouponUsage = await Order.countDocuments({
        userId: userId,
        'appliedCoupon.code': coupon.code
      });

      if (userCouponUsage >= coupon.perUserLimit) {
        return res.status(400).json({
          success: false,
          message: 'You have reached the maximum usage limit for this coupon'
        });
      }
    } else if (coupon.perUserLimit && !userId) {
      // We can't enforce per-user limit for anonymous/guest requests.
      // Decide policy: either reject or allow while warning — here we allow but inform.
      // If you'd rather block applying when userId missing, change to return 400.
      // We'll allow application but include a warning in response.
    }

    // Calculate discount
    let discount = 0;

    if (coupon.discountType === 'percentage') {
      discount = (coupon.value / 100) * cartTotal;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = Math.min(coupon.value, cartTotal);
    }

    // Round to 2 decimals
    discount = Math.round(discount * 100) / 100;
    const finalAmount = Math.max(0, Math.round((cartTotal - discount) * 100) / 100);

    const responsePayload = {
      code: coupon.code,
      discountType: coupon.discountType,
      value: coupon.value,
      discountApplied: discount,
      finalAmount,
      minOrderAmount: coupon.minOrderAmount,
      maxDiscount: coupon.maxDiscount
    };

    // If coupon had perUserLimit but no userId provided, include a warning
    if (coupon.perUserLimit && !userId) {
      responsePayload.warning = 'perUserLimit present on coupon but userId not provided — per-user usage not enforced for this request';
    }

    return res.status(200).json({ success: true, data: responsePayload });
  } catch (error) {
    console.error('Coupon validation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error validating coupon',
      error: error.message
    });
  }
}
