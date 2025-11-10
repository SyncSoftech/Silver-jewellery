// pages/api/admin/orders/[id]/track.js
import connectDb from '../../../../../middleware/mongoose';
import OrderTracking from '../../../../../models/OrderTracking';
import Order from '../../../../../models/Order';

const handler = async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Order id required' });

  // Simple admin check - replace with real auth
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = auth.split(' ')[1];
  // rudimentary: check token exists and equals some value — replace with proper auth
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'GET') {
    try {
      const timeline = await OrderTracking.getTimeline(id);
      return res.status(200).json(timeline);
    } catch (error) {
      console.error('GET track error', error);
      return res.status(500).json({ error: 'Error fetching timeline' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { status, note, location, carrier, trackingNumber, trackingUrl, eta } = req.body;
      if (!status) return res.status(400).json({ error: 'status is required' });

      // create event
      const event = await OrderTracking.addEvent(id, {
        status,
        note,
        location,
        carrier,
        trackingNumber,
        trackingUrl,
        eta: eta ? new Date(eta) : undefined,
        // Admin info: set updatedByModel to Admin (you can pass updatedBy id if you want)
        updatedByModel: 'Admin'
      });

      // Optional: update Order.status atomically (so current status is quick to read)
      try {
        const order = await Order.findById(id);
        if (order) {
          order.status = status.charAt(0).toUpperCase() + status.slice(1); // match your schema casing
          await order.save();
        }
      } catch (e) {
        console.error('Failed to update order status after tracking event', e);
      }

      return res.status(201).json(event);
    } catch (error) {
      console.error('POST track error', error);
      return res.status(500).json({ error: 'Error creating tracking event' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
};

export default connectDb(handler);
