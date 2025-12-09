const mongoose = require("mongoose");

const BirthdaySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  birthday: {
    type: Date,
    required: true
  },
  lastIssuedYear: {
    type: Number,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.models.Birthday || mongoose.model("Birthday", BirthdaySchema);
