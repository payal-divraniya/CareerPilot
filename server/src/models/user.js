const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required."], trim: true, maxlength: 100 },
  email: { type: String, required: [true, "Email is required."], trim: true, lowercase: true, unique: true, maxlength: 254 },
  password: { type: String, required: [true, "Password is required."], select: false },
}, { timestamps: true, versionKey: false });

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
