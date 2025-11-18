// getting-started.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetToken: { type: String },
  resetTokenExpiry: { type: Number },

}, { timestamps: true });


export default mongoose.models.User || mongoose.model("User", UserSchema);
// export default mongoose.model("User",UserSchema);