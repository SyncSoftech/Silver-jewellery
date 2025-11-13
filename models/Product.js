// // getting-started.js
// const mongoose = require('mongoose');

// const ProductSchema = new mongoose.Schema({
//     title: {type :String , required:true },
//     slug: {type :String , required:true, unique:true },
//     desc: {type :String , required:true },
//     img: {type :String , required:true },
//     category: {type :String , required:true },
//     size: {type :String },
//     color: {type :String },
//     price: {type :Number, required:true },
//     availableQty: {type :Number, required:true },
    
//   },{timestamps:true});
// // mongoose.models = {}
//   export default mongoose.models.Product ||mongoose.model("Product",ProductSchema);
//   // export default mongoose.model("Product",ProductSchema);


// models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    desc: { type: String, required: true },
    img: { type: String, required: true }, // Primary/featured image
    images: [{ type: String }], // Array of additional images
    category: { type: String, required: true },
    size: { type: String },
    color: { type: String },
    price: { type: Number, required: true },
    availableQty: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);