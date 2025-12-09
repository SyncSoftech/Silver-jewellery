// // // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// // import User from "@/models/User"
// // import connectDb from "@/middleware/mongoose"
// // var CryptoJS = require("crypto-js");

// // const handler = async (req, res) => {
// //     if (req.method == 'POST') {
// //         const {name,email} = req.body
// //         let u = new User({name, email, password: CryptoJS.AES.encrypt(req.body.password,'secret123').toString()})
// //         await u.save()
            
// //         res.status(200).json({ success: "success" })
// //         }
    
// //     else {
// //         res.status(400).json({ error: "this method is not allowed" })
// //     }


// // }

// // export default connectDb(handler)


// // pages/api/signup.js
// // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import User from "@/models/User"
// import connectDb from "@/middleware/mongoose"
// var CryptoJS = require("crypto-js");

// const handler = async (req, res) => {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ success: false, error: "Method not allowed" })
//   }

//   try {
//     const { name, email, password } = req.body || {}

//     // basic validations
//     if (!name || !email || !password) {
//       return res.status(400).json({ success: false, error: "Name, email and password are required." })
//     }
//     if (typeof password === 'string' && password.length < 6) {
//       return res.status(400).json({ success: false, error: "Password must be at least 6 characters." })
//     }

//     // check if user already exists
//     const existing = await User.findOne({ email: String(email).toLowerCase() })
//     if (existing) {
//       // 409 Conflict is appropriate for "already exists"
//       return res.status(409).json({ success: false, error: "Email already exists." })
//     }

//     // encrypt password using secret from env (fallback for dev, but set SECRET in production)
//     const secret = process.env.PASSWORD_SECRET || "dev_secret_replace_me"
//     const encrypted = CryptoJS.AES.encrypt(String(password), secret).toString()

//     const u = new User({
//       name,
//       email: String(email).toLowerCase(),
//       password: encrypted
//     })

//     await u.save()

//     // return success (you may also return a token if you want to log them in immediately)
//     return res.status(201).json({ success: true, message: "Account created" })
//   } catch (err) {
//     console.error("Signup error:", err)
//     // If it's a mongoose duplicate key error (in case you also have unique index), handle it:
//     if (err && err.code === 11000) {
//       return res.status(409).json({ success: false, error: "Email already exists." })
//     }
//     return res.status(500).json({ success: false, error: "Server error. Please try again later." })
//   }
// }

// export default connectDb(handler)



// pages/api/signup.js
import connectDb from "@/middleware/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const handler = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ success: false, error: "Method not allowed" });

  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ success: false, error: "Name, email and password are required." });
    if (typeof password === "string" && password.length < 6) return res.status(400).json({ success: false, error: "Password must be at least 6 characters." });

    const existing = await User.findOne({ email: String(email).toLowerCase() });
    if (existing) return res.status(409).json({ success: false, error: "Email already exists." });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(String(password), salt);

    const u = new User({
      name,
      email: String(email).toLowerCase(),
      password: hash // store bcrypt hash
    });

    await u.save();
    return res.status(201).json({ success: true, message: "Account created" });
  } catch (err) {
    console.error("Signup error:", err);
    if (err && err.code === 11000) {
      return res.status(409).json({ success: false, error: "Email already exists." });
    }
    return res.status(500).json({ success: false, error: "Server error. Please try again later." });
  }
};

export default connectDb(handler);
