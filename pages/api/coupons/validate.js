
// pages/api/coupons/validate.js
import dbConnect from '../../../middleware/mongoose';
import Coupon from '../../../models/Coupon';
import Order from '../../../models/Order'; // optional: used for per-user usage checks

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { code, cartTotal, items = [], userId } = req.body || {};

  if (!code || cartTotal === undefined || cartTotal === null) {
    return res.status(400).json({ success: false, message: 'Coupon code and cart total are required' });
  }

  try {
    await dbConnect();

    const now = new Date();

    // Find coupon that is active and within validity dates and usage limit
    const coupon = await Coupon.findOne({
      code: String(code).trim().toUpperCase(),
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
      $or: [
        { usageLimit: null },
        { $expr: { $lt: ['$usedCount', '$usageLimit'] } }
      ]
    }).lean();

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or expired coupon code' });
    }

    // Check minimum order amount
    const minOrder = coupon.minOrderAmount ?? 0;
    if (Number(cartTotal) < Number(minOrder)) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of ₹${minOrder} required to apply this coupon`
      });
    }

    // If coupon doesn't apply to all, verify at least one item matches applicableProducts or applicableCategories (if any are set)
    if (!coupon.applyToAll) {
      const hasProductRestrictions = (coupon.applicableProducts?.length || 0) > 0;
      const hasCategoryRestrictions = (coupon.applicableCategories?.length || 0) > 0;

      if (hasProductRestrictions || hasCategoryRestrictions) {
        // items expected to be: [{ product: { _id, category, ... }, qty, price }, ...]
        const isApplicable = Array.isArray(items) && items.some(item => {
          if (!item || !item.product) return false;

          const prod = item.product;
          const prodId = prod._id ? String(prod._id) : null;
          const prodCats = Array.isArray(prod.category)
            ? prod.category.map(String)
            : (prod.category ? [String(prod.category)] : []);

          let productMatch = true;
          let categoryMatch = true;

          if (hasProductRestrictions) {
            productMatch = coupon.applicableProducts.some(id => String(id) === prodId);
          }

          if (hasCategoryRestrictions) {
            categoryMatch = coupon.applicableCategories.some(catId => prodCats.includes(String(catId)));
          }

          return productMatch || categoryMatch;
        });

        if (!isApplicable) {
          return res.status(400).json({
            success: false,
            message: 'This coupon is not applicable to items in your cart'
          });
        }
      }
      // else: no product/category restrictions set — treat as global (but applyToAll was false; this is an edge-case)
    }

    // Per-user limit enforcement (only when userId provided)
    if (coupon.perUserLimit && Number.isFinite(Number(coupon.perUserLimit))) {
      if (userId) {
        // Count prior orders where this coupon was used
        const usedByUser = await Order.countDocuments({
          userId: userId,
          'appliedCoupon.code': coupon.code
        });

        if (usedByUser >= coupon.perUserLimit) {
          return res.status(400).json({
            success: false,
            message: 'You have reached the maximum usage limit for this coupon'
          });
        }
      } else {
        // no userId provided — include a warning in response (we allow application but don't enforce per-user)
      }
    }

    // Calculate discount
    let discount = 0;
    const numericCartTotal = Number(cartTotal) || 0;

    if (coupon.discountType === 'percentage') {
      discount = (Number(coupon.value) / 100) * numericCartTotal;
      if (coupon.maxDiscount !== null && coupon.maxDiscount !== undefined && Number(coupon.maxDiscount) > 0) {
        if (discount > Number(coupon.maxDiscount)) discount = Number(coupon.maxDiscount);
      }
    } else { // fixed
      discount = Math.min(Number(coupon.value) || 0, numericCartTotal);
    }

    // Round to 2 decimals
    discount = Math.round(discount * 100) / 100;
    const finalAmount = Math.max(0, Math.round((numericCartTotal - discount) * 100) / 100);

    const responsePayload = {
      code: coupon.code,
      discountType: coupon.discountType,
      value: coupon.value,
      discountApplied: discount,
      finalAmount,
      minOrderAmount: coupon.minOrderAmount,
      maxDiscount: coupon.maxDiscount,
      applyToAll: !!coupon.applyToAll,
      applicableProducts: coupon.applicableProducts || [],
      applicableCategories: coupon.applicableCategories || []
    };

    if (coupon.perUserLimit && !userId) {
      responsePayload.warning = 'perUserLimit present on coupon but userId not provided — per-user usage not enforced for this request';
    }

    return res.status(200).json({ success: true, data: responsePayload });
  } catch (error) {
    console.error('Coupon validation error:', error);
    return res.status(500).json({ success: false, message: 'Error validating coupon', error: error.message });
  }
}
