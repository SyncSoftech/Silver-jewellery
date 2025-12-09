// import connectDb from "../../middleware/mongoose";  // Your DB connection middleware
// import User from "../../models/User";  // Your User model
// import CryptoJS from "crypto-js";  // For encrypting the new password

// const handler = async (req, res) => {
//   if (req.method === "PUT") {
//     const { token, password } = req.body;

//     // Find the user by reset token
//     const user = await User.findOne({ resetToken: token });
//     if (!user) {
//       return res.status(400).json({ error: "User not found or invalid token" });
//     }

//     // Check if the token has expired
//     if (new Date() > user.resetTokenExpiry) {
//       return res.status(400).json({ error: "Token has expired" });
//     }

//     // Encrypt the new password
//     const encryptedPassword = CryptoJS.AES.encrypt(password, "secret123").toString();

//     try {
//       // Update the user's password and remove resetToken & resetTokenExpiry
//       await User.findByIdAndUpdate(
//         user._id,
//         {
//           password: encryptedPassword,
//           resetToken: undefined,
//           resetTokenExpiry: undefined
//         }
//       );

//       return res.status(200).json({ success: "Password reset successfully!" });
//     } catch (error) {
//       console.error("Error resetting password:", error);
//       return res.status(500).json({ error: "Error resetting password" });
//     }
//   } else {
//     return res.status(405).json({ error: "Method Not Allowed" });
//   }
// };

// export default connectDb(handler);


// import connectDb from "../../middleware/mongoose";
// import User from "../../models/User";
// import CryptoJS from "crypto-js";

// const handler = async (req, res) => {
//   if (req.method === "PUT") {
//     const { token, password } = req.body;

//     // Validate input
//     if (!token || !password) {
//       return res.status(400).json({ error: "Token and password are required" });
//     }

//     if (typeof password === 'string' && password.length < 6) {
//       return res.status(400).json({ error: "Password must be at least 6 characters." });
//     }

//     try {
//       // Find the user by reset token
//       const user = await User.findOne({ resetToken: token });
//       if (!user) {
//         return res.status(400).json({ error: "User not found or invalid token" });
//       }

//       // Check if the token has expired
//       if (new Date() > user.resetTokenExpiry) {
//         return res.status(400).json({ error: "Token has expired" });
//       }

//       // Use the SAME secret as signup/login for consistency
//       const secret = process.env.PASSWORD_SECRET || "dev_secret_replace_me";
//       const encryptedPassword = CryptoJS.AES.encrypt(password, secret).toString();

//       // Update the user's password and remove resetToken & resetTokenExpiry
//       await User.findByIdAndUpdate(
//         user._id,
//         {
//           password: encryptedPassword,
//           resetToken: undefined,
//           resetTokenExpiry: undefined
//         }
//       );

//       return res.status(200).json({ success: true, message: "Password reset successfully!" });
//     } catch (error) {
//       console.error("Error resetting password:", error);
//       return res.status(500).json({ error: "Error resetting password" });
//     }
//   } else {
//     return res.status(405).json({ error: "Method Not Allowed" });
//   }
// };

// export default connectDb(handler);


// pages/api/reset-password.js
import connectDb from "@/middleware/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const handler = async (req, res) => {
  if (req.method !== "PUT") return res.status(405).json({ error: "Method Not Allowed" });

  const { token, password } = req.body || {};
  if (!token || !password) return res.status(400).json({ error: "Token and password are required" });
  if (typeof password === "string" && password.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters." });

  try {
    // Hash the incoming token the same way you *should* store it
    const hashedToken = crypto.createHash("sha256").update(String(token)).digest("hex");

    // Try to find by hashed token first (preferred), then by plain token (compat)
    let user = await User.findOne({ resetToken: hashedToken });
    if (!user) {
      user = await User.findOne({ resetToken: token }); // fallback for legacy plain storage
    }

    if (!user) {
      return res.status(400).json({ error: "User not found or invalid token" });
    }

    // Normalize expiry check: handle number (ms) and Date/string
    const expiry = user.resetTokenExpiry;
    const now = Date.now();
    let expiryTime = null;
    if (!expiry) {
      expiryTime = 0;
    } else if (typeof expiry === "number") {
      expiryTime = expiry;
    } else {
      expiryTime = new Date(expiry).getTime();
    }

    if (now > expiryTime) {
      return res.status(400).json({ error: "Token has expired" });
    }

    // All good: hash new password and save
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(String(password), salt);

    user.password = hash;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return res.status(200).json({ success: true, message: "Password reset successfully!" });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ error: "Error resetting password" });
  }
};

export default connectDb(handler);
