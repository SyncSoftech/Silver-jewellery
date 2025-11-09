import Razorpay from 'razorpay';
import mongoose from 'mongoose';
import connectDB from '../../middleware/mongoose';
import Order from '../../models/Order';
import Address from '../../models/Address';
import { verifyToken } from '../../utils/jwt';

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Verify authentication
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const { cart, subTotal, addressId } = req.body;
    
    // Validate required fields
    if (!cart || !subTotal || !addressId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: cart, subTotal, addressId' 
      });
    }

    // Get the address details
    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).json({ success: false, error: 'Address not found' });
    }

    // Generate a unique order ID
    const oid = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Convert amount to paise (Razorpay's smallest currency unit)
    const amountInPaise = Math.round(Number(subTotal) * 100);

    // Create order options
    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: oid,
      payment_capture: 1, // Auto-capture payment
      notes: {
        orderId: oid,
        userId: decoded.userId,
        addressId: addressId
      }
    };

    // Create order in Razorpay
    const razorpayOrder = await razorpay.orders.create(options);

    // Prepare order items - ensure all required fields are present and properly formatted
    const orderItems = Object.values(cart).map(item => {
      // Ensure product ID is a valid ObjectId
      const productId = new mongoose.Types.ObjectId(item._id || item.productId);
      
      return {
        product: productId,
        name: item.name || 'Product',
        price: parseFloat(item.price) || 0,
        quantity: parseInt(item.qty || item.quantity || 1, 10),
        image: item.img || item.image || ''
      };
    });
    
    // Validate that we have at least one valid order item
    if (!orderItems.length) {
      return res.status(400).json({
        success: false,
        error: 'No valid items in cart'
      });
    }

    // Prepare address data
    const addressData = {
      fullName: address.fullName,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state,
      country: address.country || 'India', // Default to India if not provided
      postalCode: address.postalCode,
      landmark: address.landmark || ''
    };

    // Create order in our database
    const newOrder = new Order({
      userId: decoded.userId.toString(),
      orderItems: orderItems,
      shippingAddress: addressData,
      billingAddress: addressData, // Using same address for billing and shipping
      amount: parseFloat(subTotal),
      status: 'Pending',
      paymentInfo: {
        razorpayOrderId: razorpayOrder.id,
        status: 'created'
      }
    });

    await newOrder.save();

    // Return Razorpay order details to frontend
    res.status(200).json({
      success: true,
      order: razorpayOrder,
      orderId: newOrder.orderId,
      dbOrderId: newOrder._id
    });

  } catch (error) {
    console.error('Error in pretransaction:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to create order',
      details: error.errors || {}
    });
  }
};

export default connectDB(handler);
