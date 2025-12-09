// // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import User from "@/models/User"
// import connectDb from "@/middleware/mongoose"
// var CryptoJS = require("crypto-js");
// var jwt = require('jsonwebtoken');

// const handler = async (req, res) => {
//     if (req.method == 'POST') {
//         let user = await User.findOne({ "email": req.body.email })
//         const bytes  = CryptoJS.AES.decrypt(user.password, 'secret123');
//         let decryptedPass = bytes.toString(CryptoJS.enc.Utf8);
//         if (user) {
//             if (req.body.email == user.email && req.body.password == decryptedPass) {
//                 var token = jwt.sign({user: user._id, email:user.email, name:user.name }, 'jwtsecret',{expiresIn:"2d"});
//                 res.status(200).json({success: true,token})
//             }else{

//                 res.status(200).json({ success: false, error:"Invaild Credentials" })
//             }
//         }
//         else{
//             res.status(200).json({ success: false, error:"No user found" })

//         }
//     }

//     else {
//         res.status(400).json({ error: "this method is not allowed" })
//     }


// }

// export default connectDb(handler)


// // pages/api/login.js
// import User from "@/models/User"
// import connectDb from "@/middleware/mongoose"
// var CryptoJS = require("crypto-js");
// var jwt = require('jsonwebtoken');

// const handler = async (req, res) => {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ success: false, error: "Method not allowed" })
//   }

//   try {
//     const { email, password } = req.body || {}
//     if (!email || !password) {
//       return res.status(400).json({ success: false, error: "Email and password are required." })
//     }

//     const user = await User.findOne({ email: String(email).toLowerCase() })
//     if (!user) {
//       return res.status(404).json({ success: false, error: "No user found with this email." })
//     }

//     const secret = process.env.PASSWORD_SECRET || "dev_secret_replace_me"
//     // decrypt and compare
//     let decryptedPass = ""
//     try {
//       const bytes  = CryptoJS.AES.decrypt(user.password, secret);
//       decryptedPass = bytes.toString(CryptoJS.enc.Utf8);
//     } catch (e) {
//       console.error("Decrypt error:", e)
//       return res.status(500).json({ success: false, error: "Server error." })
//     }

//     if (password !== decryptedPass) {
//       return res.status(401).json({ success: false, error: "Invalid credentials" })
//     }

//     const jwtSecret = process.env.JWT_SECRET || "jwtsecret"
//     const token = jwt.sign({ user: user._id, email: user.email, name: user.name }, jwtSecret, { expiresIn: "2d" })

//     return res.status(200).json({ success: true, token })
//   } catch (err) {
//     console.error("Login error:", err)
//     return res.status(500).json({ success: false, error: "Server error. Please try again later." })
//   }
// }

// export default connectDb(handler)


// pages/api/login.js (debug version - remove extra logs after debugging)
import connectDb from "@/middleware/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import CryptoJS from "crypto-js"; // only if you still support legacy AES
import jwt from "jsonwebtoken";

const handler = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ success: false, error: "Method not allowed" });

  try {
    const { email, password } = req.body || {};
    console.log("[LOGIN] payload:", { email: !!email, passwordPresent: !!password });

    if (!email || !password) return res.status(400).json({ success: false, error: "Email and password are required." });

    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user) {
      console.log("[LOGIN] user not found for", email);
      return res.status(404).json({ success: false, error: "No user found with this email." });
    }

    console.log("[LOGIN] stored password prefix:", String(user.password).slice(0,10));

    // If bcrypt hash
    if (typeof user.password === "string" && user.password.startsWith("$2")) {
      const ok = await bcrypt.compare(String(password), user.password);
      console.log("[LOGIN] bcrypt compare result:", ok);
      if (!ok) return res.status(401).json({ success: false, error: "Invalid credentials (bcrypt mismatch)" });
    } else {
      // Legacy AES path (if applicable)
      try {
        const secret = process.env.PASSWORD_SECRET || "dev_secret_replace_me";
        const bytes = CryptoJS.AES.decrypt(user.password, secret);
        const decryptedPass = bytes.toString(CryptoJS.enc.Utf8);
        console.log("[LOGIN] legacy decrypt produced length:", decryptedPass.length);
        if (decryptedPass !== String(password)) {
          return res.status(401).json({ success: false, error: "Invalid credentials (legacy mismatch)" });
        }
        // optional: migrate to bcrypt here
      } catch (e) {
        console.error("[LOGIN] decrypt error:", e);
        return res.status(500).json({ success: false, error: "Server error during decrypt" });
      }
    }

    // success -> sign JWT
    const jwtSecret = process.env.JWT_SECRET || "jwtsecret";
    const token = jwt.sign({ user: user._id, email: user.email, name: user.name }, jwtSecret, { expiresIn: "2d" });
    return res.status(200).json({ success: true, token });
  } catch (err) {
    console.error("[LOGIN] unexpected error:", err);
    return res.status(500).json({ success: false, error: "Server error. Please try again later." });
  }
};

export default connectDb(handler);
