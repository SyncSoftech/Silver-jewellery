// // pages/api/orders/replace.js
// import connectDB from '../../../middleware/mongoose';
// import Order from '../../../models/Order';
// import OrderTracking from '../../../models/OrderTracking';
// import { verifyToken } from '../../../utils/jwt';

// // NOTE:
// // - Users can create a replace request (POST).
// // - Admins can approve or reject that request (PATCH with action: 'approve'|'reject').
// // - GET checks order details (no changes).
// // - Replace requests are allowed only for orders in allowed statuses (adjust as needed).

// const handler = async (req, res) => {
//   try {
//     // GET: check order details
//     if (req.method === 'GET') {
//       const { orderId } = req.query;
//       if (!orderId) return res.status(400).json({ success: false, error: 'orderId required' });

//       const order = await Order.findById(orderId).lean();
//       if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

//       return res.status(200).json({ success: true, order });
//     }

//     // Only POST and PATCH allowed
//     if (!['POST', 'PATCH'].includes(req.method)) {
//       return res.status(405).json({ success: false, error: 'Method not allowed' });
//     }

//     // Auth
//     const token = req.headers.authorization?.split(' ')[1];
//     const decoded = verifyToken(token);
//     if (!decoded?.userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

//     // POST -> user requests a replacement
//     if (req.method === 'POST') {
//       const { orderId, items = [], reason = '' } = req.body;
//       if (!orderId) return res.status(400).json({ success: false, error: 'orderId required' });

//       const order = await Order.findById(orderId);
//       if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

//       // Ownership check
//       if (order.userId?.toString() !== decoded.userId?.toString()) {
//         return res.status(403).json({ success: false, error: 'Forbidden: you do not own this order' });
//       }

//       // Allowed statuses for requesting replacement (adjust to your business rules)
//       const allowedForReplace = ['Delivered', 'Completed', 'Shipped', 'Paid'];
//       if (!allowedForReplace.includes(order.status)) {
//         return res.status(400).json({
//           success: false,
//           error: `Cannot request replacement for order with status: ${order.status}. Allowed: ${allowedForReplace.join(', ')}.`
//         });
//       }

//       // Mark order as replace-requested and save optional details to notes
//       order.status = 'Replace Requested';
//       // keep note of what user asked to replace and why
//       const replaceNoteParts = [];
//       if (items && items.length) replaceNoteParts.push(`Items: ${JSON.stringify(items)}`);
//       if (reason) replaceNoteParts.push(`Reason: ${reason}`);
//       if (replaceNoteParts.length) order.notes = `${order.notes || ''}\nReplace Request: ${replaceNoteParts.join(' | ')}`;

//       await order.save();

//       // Add a tracking event
//       try {
//         await OrderTracking.addEvent(order._id, {
//           status: 'replace requested',
//           note: `User requested replacement${reason ? `: ${reason}` : ''}`,
//           updatedBy: decoded.userId,
//           updatedByModel: 'User',
//           createdAt: Date.now()
//         });
//       } catch (e) {
//         // non-fatal: log and continue
//         console.warn('Failed to create tracking event for replace request', e && e.message ? e.message : e);
//       }

//       return res.status(200).json({ success: true, message: 'Replace request submitted', order });
//     }

//     // PATCH -> admin approves or rejects a replace request
//     if (req.method === 'PATCH') {
//       const { orderId, action, adminNote = '' } = req.body;
//       if (!orderId) return res.status(400).json({ success: false, error: 'orderId required' });
//       if (!action || !['approve', 'reject'].includes(action)) {
//         return res.status(400).json({ success: false, error: "action required and must be 'approve' or 'reject'" });
//       }

//       // Only admin allowed for approve/reject
//       if (!decoded.isAdmin) {
//         return res.status(403).json({ success: false, error: 'Forbidden: admin privileges required' });
//       }

//       const order = await Order.findById(orderId);
//       if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

//       // Only operate if there is an outstanding replace request
//       if (order.status !== 'Replace Requested') {
//         return res.status(400).json({
//           success: false,
//           error: `Order status must be 'Replace Requested' to ${action}. Current: ${order.status}`
//         });
//       }

//       if (action === 'approve') {
//         order.status = 'Replace Approved';
//         // optionally attach admin note
//         order.notes = `${order.notes || ''}\nReplace Approved: ${adminNote}`;
//         await order.save();

//         // add tracking event
//         try {
//           await OrderTracking.addEvent(order._id, {
//             status: 'replace approved',
//             note: adminNote || 'Replace approved by admin',
//             updatedBy: decoded.userId,
//             updatedByModel: 'Admin',
//             createdAt: Date.now()
//           });
//         } catch (e) {
//           console.warn('Failed to create tracking event for replace approval', e && e.message ? e.message : e);
//         }

//         // You may want to handle stock adjustments / return flow here (not implemented)
//         return res.status(200).json({ success: true, message: 'Replace request approved', order });
//       }

//       if (action === 'reject') {
//         order.status = 'Replace Rejected';
//         order.notes = `${order.notes || ''}\nReplace Rejected: ${adminNote}`;
//         await order.save();

//         try {
//           await OrderTracking.addEvent(order._id, {
//             status: 'replace rejected',
//             note: adminNote || 'Replace rejected by admin',
//             updatedBy: decoded.userId,
//             updatedByModel: 'Admin',
//             createdAt: Date.now()
//           });
//         } catch (e) {
//           console.warn('Failed to create tracking event for replace rejection', e && e.message ? e.message : e);
//         }

//         return res.status(200).json({ success: true, message: 'Replace request rejected', order });
//       }
//     }

//     // fallback (shouldn't reach here)
//     return res.status(405).json({ success: false, error: 'Method not allowed' });
//   } catch (error) {
//     console.error('Error in replace API:', error);
//     return res.status(500).json({ success: false, error: error.message || 'Server error' });
//   }
// };

// export default connectDB(handler);



// pages/api/orders/replace.js
import connectDB from '../../../middleware/mongoose';
import Order from '../../../models/Order';
import OrderTracking from '../../../models/OrderTracking';
import { verifyToken } from '../../../utils/jwt';

const isStringArray = (arr) => Array.isArray(arr) && arr.every(i => typeof i === 'string' && i.trim().length > 0);

const handler = async (req, res) => {
  try {
    // GET: check order details
    if (req.method === 'GET') {
      const { orderId } = req.query;
      if (!orderId) return res.status(400).json({ success: false, error: 'orderId required' });

      const order = await Order.findById(orderId).lean();
      if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

      return res.status(200).json({ success: true, order });
    }

    // Only POST and PATCH allowed
    if (!['POST', 'PATCH'].includes(req.method)) {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    // Auth
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded?.userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    // POST -> user requests a replacement
    if (req.method === 'POST') {
      const { orderId, items = [], reason = '', replaceRequestImages = [] } = req.body;
      
      console.log('=== REPLACE REQUEST DEBUG ===');
      console.log('Received replaceRequestImages:', replaceRequestImages);
      console.log('Type:', typeof replaceRequestImages);
      console.log('Is Array:', Array.isArray(replaceRequestImages));
      
      if (!orderId) return res.status(400).json({ success: false, error: 'orderId required' });

      const order = await Order.findById(orderId);
      if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

      // Ownership check
      if (order.userId?.toString() !== decoded.userId?.toString()) {
        return res.status(403).json({ success: false, error: 'Forbidden: you do not own this order' });
      }

      // Allowed statuses for requesting replacement
      const allowedForReplace = ['Delivered', 'Completed', 'Shipped', 'Paid'];
      if (!allowedForReplace.includes(order.status)) {
        return res.status(400).json({
          success: false,
          error: `Cannot request replacement for order with status: ${order.status}. Allowed: ${allowedForReplace.join(', ')}.`
        });
      }

      // Validate and process images
      let imagesToSave = [];
      if (replaceRequestImages && Array.isArray(replaceRequestImages) && replaceRequestImages.length > 0) {
        // Filter and validate each URL
        imagesToSave = replaceRequestImages
          .filter(url => url && typeof url === 'string' && url.trim().length > 0)
          .map(url => url.trim());
        
        console.log('Processed imagesToSave:', imagesToSave);
        
        if (imagesToSave.length === 0) {
          console.log('Warning: replaceRequestImages array was provided but all entries were invalid');
        }
      }

      // Mark order as replace-requested
      order.status = 'Replace Requested';
      
      // Save images to Order document
      if (imagesToSave.length > 0) {
        if (!order.replaceRequestImages) {
          order.replaceRequestImages = [];
        }
        imagesToSave.forEach(url => {
          order.replaceRequestImages.push(url);
        });
        order.markModified('replaceRequestImages');
        console.log('Order replaceRequestImages after push:', order.replaceRequestImages);
      }

      // Build notes
      const replaceNoteParts = [];
      if (items && items.length) replaceNoteParts.push(`Items: ${JSON.stringify(items)}`);
      if (reason) replaceNoteParts.push(`Reason: ${reason}`);
      if (imagesToSave.length) replaceNoteParts.push(`Images: ${imagesToSave.length} uploaded`);
      if (replaceNoteParts.length) {
        order.notes = `${order.notes || ''}\nReplace Request: ${replaceNoteParts.join(' | ')}`;
      }

      await order.save();
      console.log('Order saved successfully');

      // Add tracking event with images
      try {
        console.log('Creating tracking event with images:', imagesToSave);
        
        // Create the tracking document directly instead of using addEvent
        const trackingEvent = new OrderTracking({
          orderId: order._id,
          status: 'replace requested',
          note: `User requested replacement${reason ? `: ${reason}` : ''}`,
          updatedBy: decoded.userId,
          updatedByModel: 'User',
          replaceRequestImages: imagesToSave, // Pass the array directly
          createdAt: new Date()
        });
        
        console.log('Tracking event before save:', JSON.stringify(trackingEvent.toObject(), null, 2));
        
        await trackingEvent.save();
        
        console.log('Tracking event saved successfully');
        console.log('Saved tracking event:', JSON.stringify(trackingEvent.toObject(), null, 2));
      } catch (e) {
        console.error('Failed to create tracking event:', e);
        console.error('Error details:', e.message);
        // Return error so we know what's happening
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to create tracking event: ' + (e.message || 'Unknown error') 
        });
      }

      return res.status(200).json({ success: true, message: 'Replace request submitted', order });
    }

    // PATCH -> admin approves or rejects a replace request
    if (req.method === 'PATCH') {
      const { orderId, action, adminNote = '', replaceRequestImages = [] } = req.body;
      if (!orderId) return res.status(400).json({ success: false, error: 'orderId required' });
      if (!action || !['approve', 'reject'].includes(action)) {
        return res.status(400).json({ success: false, error: "action required and must be 'approve' or 'reject'" });
      }

      // Only admin allowed for approve/reject
      if (!decoded.isAdmin) {
        return res.status(403).json({ success: false, error: 'Forbidden: admin privileges required' });
      }

      const order = await Order.findById(orderId);
      if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

      // Only operate if there is an outstanding replace request
      if (order.status !== 'Replace Requested') {
        return res.status(400).json({
          success: false,
          error: `Order status must be 'Replace Requested' to ${action}. Current: ${order.status}`
        });
      }

      // Validate and process admin images
      let adminImages = [];
      if (replaceRequestImages && Array.isArray(replaceRequestImages) && replaceRequestImages.length > 0) {
        adminImages = replaceRequestImages
          .filter(url => url && typeof url === 'string' && url.trim().length > 0)
          .map(url => url.trim());
      }

      if (action === 'approve') {
        order.status = 'Replace Approved';
        order.notes = `${order.notes || ''}\nReplace Approved: ${adminNote}`;
        
        if (adminImages.length > 0) {
          if (!order.replaceRequestImages) {
            order.replaceRequestImages = [];
          }
          adminImages.forEach(url => {
            order.replaceRequestImages.push(url);
          });
          order.markModified('replaceRequestImages');
        }
        
        await order.save();

        // Create tracking event directly
        try {
          const trackingEvent = new OrderTracking({
            orderId: order._id,
            status: 'replace approved',
            note: adminNote || 'Replace approved by admin',
            updatedBy: decoded.userId,
            updatedByModel: 'Admin',
            replaceRequestImages: adminImages,
            createdAt: new Date()
          });
          await trackingEvent.save();
        } catch (e) {
          console.warn('Failed to create tracking event for replace approval', e);
        }

        return res.status(200).json({ success: true, message: 'Replace request approved', order });
      }

      if (action === 'reject') {
        order.status = 'Replace Rejected';
        order.notes = `${order.notes || ''}\nReplace Rejected: ${adminNote}`;
        
        if (adminImages.length > 0) {
          if (!order.replaceRequestImages) {
            order.replaceRequestImages = [];
          }
          adminImages.forEach(url => {
            order.replaceRequestImages.push(url);
          });
          order.markModified('replaceRequestImages');
        }
        
        await order.save();

        // Create tracking event directly
        try {
          const trackingEvent = new OrderTracking({
            orderId: order._id,
            status: 'replace rejected',
            note: adminNote || 'Replace rejected by admin',
            updatedBy: decoded.userId,
            updatedByModel: 'Admin',
            replaceRequestImages: adminImages,
            createdAt: new Date()
          });
          await trackingEvent.save();
        } catch (e) {
          console.warn('Failed to create tracking event for replace rejection', e);
        }

        return res.status(200).json({ success: true, message: 'Replace request rejected', order });
      }
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in replace API:', error);
    return res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
};

export default connectDB(handler);