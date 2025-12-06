import connectDB from '../../../middleware/mongoose';
import Address from '../../../models/Address';
import { verifyToken } from '../../../utils/jwt';

const handler = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded || !decoded.userId) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  const { id } = req.query;

  if (req.method === "PUT") {
    try {
      const {
        fullName, phone, street, city, state,
        country, postalCode, landmark, addressType, isDefault
      } = req.body;

      const address = await Address.findOne({ _id: id, user: decoded.userId });

      if (!address) {
        return res.status(404).json({ success: false, error: "Address not found" });
      }

      // If this is default → unset old defaults
      if (isDefault) {
        await Address.updateMany(
          { user: decoded.userId, _id: { $ne: id } },
          { $set: { isDefault: false } }
        );
      }

      // Update fields
      address.fullName = fullName ?? address.fullName;
      address.phone = phone ?? address.phone;
      address.street = street ?? address.street;
      address.city = city ?? address.city;
      address.state = state ?? address.state;
      address.country = country ?? address.country;
      address.postalCode = postalCode ?? address.postalCode;
      address.landmark = landmark ?? address.landmark;
      address.addressType = addressType ?? address.addressType;
      address.isDefault = isDefault ?? address.isDefault;

      await address.save();

      return res.status(200).json({ success: true, address });

    } catch (err) {
      console.error("PUT address error:", err);
      return res.status(500).json({ success: false, error: "Failed to update address" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const address = await Address.findOneAndDelete({ _id: id, user: decoded.userId });

      if (!address) {
        return res.status(404).json({ success: false, error: "Address not found" });
      }

      return res.status(200).json({ success: true, message: "Address deleted" });

    } catch (err) {
      console.error("DELETE address error:", err);
      return res.status(500).json({ success: false, error: "Failed to delete address" });
    }
  }

  res.setHeader("Allow", ["PUT", "DELETE"]);
  res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
};

export default connectDB(handler);
