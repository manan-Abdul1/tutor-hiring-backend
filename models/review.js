const mongoose = require("mongoose")

const review = new mongoose.Schema({
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  rating: String,
  desc: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
})

const Review = mongoose.model("Review", review)
module.exports = Review
