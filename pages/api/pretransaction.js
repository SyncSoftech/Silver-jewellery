// // pages/api/pretransaction.js
// import Razorpay from 'razorpay';
// import mongoose from 'mongoose';
// import connectDB from '../../middleware/mongoose';
// import Order from '../../models/Order';
// import Address from '../../models/Address';
// import Product from '../../models/Product';
// import { verifyToken } from '../../utils/jwt';
// import { validateStockAvailability } from '../../utils/inventory';

// const handler = async (req, res) => {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ success: false, error: 'Method not allowed' });
//   }

//   try {
//     const token = req.headers.authorization?.split(' ')[1];
//     const decoded = verifyToken(token);
//     if (!decoded?.userId) {
//       return res.status(401).json({ success: false, error: 'Unauthorized' });
//     }

//     const { cart, subTotal, addressId } = req.body;
//     if (!cart || !subTotal || !addressId) {
//       return res.status(400).json({ success: false, error: 'Missing required fields: cart, subTotal, addressId' });
//     }

//     const address = await Address.findById(addressId);
//     if (!address) return res.status(404).json({ success: false, error: 'Address not found' });

//     // Validate stock availability before creating order
//     // Cart structure: { productId: { qty, price, name, ... } }
//     const cartItems = Object.entries(cart).map(([productId, item]) => ({
//       productId: productId, // Use the key as productId
//       qty: item.qty || item.quantity || 1
//     }));

//     console.log('Cart items for validation:', JSON.stringify(cartItems, null, 2));

//     const stockValidation = await validateStockAvailability(cartItems);
    
//     console.log('Stock validation result:', JSON.stringify(stockValidation, null, 2));
    
//     if (!stockValidation.valid) {
//       console.warn('Stock validation failed:', stockValidation.errors);
//       return res.status(409).json({
//         success: false,
//         error: 'Insufficient stock for some items',
//         stockErrors: stockValidation.errors
//       });
//     }

//     const razorpay = new Razorpay({
//       key_id: process.env.RAZORPAY_KEY_ID,
//       key_secret: process.env.RAZORPAY_KEY_SECRET,
//     });

//     const amountInPaise = Math.round(Number(subTotal) * 100);

//     const options = {
//       amount: amountInPaise,
//       currency: 'INR',
//       receipt: `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
//       payment_capture: 1,
//       notes: {
//         userId: decoded.userId,
//         addressId,
//       },
//     };

//     const razorpayOrder = await razorpay.orders.create(options);

//     // Create order items using the same cart structure (productId as key)
//     // Handle both ObjectId and slug formats
//     const orderItems = [];
//     for (const [productId, item] of Object.entries(cart)) {
//       let product;
//       try {
//         // Try to find by ObjectId first
//         product = await Product.findById(productId);
//       } catch (err) {
//         // If CastError (invalid ObjectId), try finding by slug
//         if (err.name === 'CastError') {
//           product = await Product.findOne({ slug: productId });
//         }
//       }

//       if (!product) {
//         return res.status(400).json({ 
//           success: false, 
//           error: `Product not found: ${productId}` 
//         });
//       }

//       orderItems.push({
//         product: product._id,
//         name: item.name || product.title || 'Product',
//         price: Number(item.price) || product.price || 0,
//         quantity: parseInt(item.qty ?? item.quantity ?? 1, 10),
//         image: item.img || product.img || '',
//       });
//     }
    
//     if (!orderItems.length) return res.status(400).json({ success: false, error: 'No valid items in cart' });

//     const addr = {
//       fullName: address.fullName,
//       phone: address.phone,
//       street: address.street,
//       city: address.city,
//       state: address.state,
//       country: address.country || 'India',
//       postalCode: address.postalCode,
//       landmark: address.landmark || '',
//     };

//     const newOrder = await Order.create({
//       userId: decoded.userId.toString(),
//       orderItems,
//       shippingAddress: addr,
//       billingAddress: addr,
//       amount: Number(subTotal),
//       status: 'Pending',
//       paymentInfo: {
//         razorpayOrderId: razorpayOrder.id,
//         status: 'created'
//       }
//     });

//     console.log('Saved order id:', newOrder._id.toString(), 'razorpayOrderId:', razorpayOrder.id);

//     return res.status(200).json({
//       success: true,
//       order: razorpayOrder,    // Use order.id on client to open Razorpay
//       dbOrderId: newOrder._id  // Use this to identify DB order later
//     });
//   } catch (error) {
//     console.error('Error in pretransaction:', error);
//     return res.status(500).json({ success: false, error: error.message || 'Failed to create order' });
//   }
// };

// export default connectDB(handler);



// pages/api/pretransaction.js
import Razorpay from 'razorpay';
import mongoose from 'mongoose';
import connectDB from '../../middleware/mongoose';
import Order from '../../models/Order';
import Address from '../../models/Address';
import Product from '../../models/Product';
import { verifyToken } from '../../utils/jwt';
import { validateStockAvailability } from '../../utils/inventory';

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = verifyToken(token);

    const userId = decoded?.user || decoded?.userId || decoded?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const { cart, subTotal, addressId, appliedCoupon = null } = req.body;

    if (!cart || typeof subTotal === 'undefined' || !addressId) {
      return res.status(400).json({ success: false, error: 'Missing required fields: cart, subTotal, addressId' });
    }

    const address = await Address.findById(addressId);
    if (!address) return res.status(404).json({ success: false, error: 'Address not found' });

    // Validate stock availability
    const cartItems = Object.entries(cart).map(([productId, item]) => ({
      productId,
      qty: item.qty || item.quantity || 1
    }));

    console.log('Cart items for validation:', JSON.stringify(cartItems, null, 2));
    const stockValidation = await validateStockAvailability(cartItems);
    console.log('Stock validation result:', JSON.stringify(stockValidation, null, 2));

    if (!stockValidation.valid) {
      console.warn('Stock validation failed:', stockValidation.errors);
      return res.status(409).json({
        success: false,
        error: 'Insufficient stock for some items',
        stockErrors: stockValidation.errors
      });
    }

    // Compute discount & finalAmount using appliedCoupon if provided
    let discountAmount = 0;
    let couponCode = null;
    let appliedCouponToSave = null;

    if (appliedCoupon) {
      discountAmount = Number(appliedCoupon.discount ?? appliedCoupon.discountApplied ?? 0) || 0;
      couponCode = appliedCoupon.code || appliedCoupon.couponCode || null;
      appliedCouponToSave = {
        code: couponCode,
        discountType: appliedCoupon.discountType || appliedCoupon.type || '',
        value: Number(appliedCoupon.value ?? appliedCoupon.amount ?? 0) || 0,
        discountApplied: discountAmount
      };
    }

    const amountNumber = Number(subTotal) || 0;
    const finalAmount = Math.max(0, Math.round((amountNumber - discountAmount) * 100) / 100);

    // Razorpay setup — use finalAmount here (in paise)
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const amountInPaise = Math.round(finalAmount * 100); // must be integer paise

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      payment_capture: 1,
      notes: {
        userId,
        addressId,
        couponCode: couponCode || '',
        discountAmount: discountAmount || 0,
        finalAmount
      },
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Build orderItems
    const orderItems = [];
    for (const [productId, item] of Object.entries(cart)) {
      let product = null;
      try {
        product = await Product.findById(productId);
      } catch (err) {
        // ignore
      }
      if (!product) product = await Product.findOne({ slug: productId });
      if (!product) {
        return res.status(400).json({
          success: false,
          error: `Product not found: ${productId}`
        });
      }

      orderItems.push({
        product: product._id,
        name: item.name || product.title || 'Product',
        price: Number(item.price) || Number(product.price) || 0,
        quantity: parseInt(item.qty ?? item.quantity ?? 1, 10),
        image: item.img || product.img || '',
      });
    }

    if (!orderItems.length) return res.status(400).json({ success: false, error: 'No valid items in cart' });

    const addr = {
      fullName: address.fullName,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state,
      country: address.country || 'India',
      postalCode: address.postalCode,
      landmark: address.landmark || '',
    };

    // Create DB order — include finalAmount, discountAmount, appliedCoupon
    const newOrder = await Order.create({
      userId: String(userId),
      orderItems,
      shippingAddress: addr,
      billingAddress: addr,
      amount: amountNumber,
      shippingAmount: 0,
      taxAmount: 0,
      couponCode: couponCode || undefined,
      discountAmount: discountAmount || 0,
      finalAmount: finalAmount,
      appliedCoupon: appliedCouponToSave ?? null,
      status: 'Pending',
      paymentInfo: {
        razorpayOrderId: razorpayOrder.id,
        status: 'created'
      }
    });

    console.log('Saved order id:', newOrder._id.toString(), 'razorpayOrderId:', razorpayOrder.id);

    return res.status(200).json({
      success: true,
      order: razorpayOrder,    // contains amount (paise) equal to finalAmount
      dbOrderId: newOrder._id,
      finalAmount,
      discountAmount
    });
  } catch (error) {
    console.error('Error in pretransaction:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to create order' });
  }
};

export default connectDB(handler);
