const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Ensure unique usernames
  bio: String
}, { timestamps: true }) // Adds createdAt and updatedAt timestamps

module.exports = mongoose.model("User", userSchema)
