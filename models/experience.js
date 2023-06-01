const mongoose = require("mongoose")

const experience = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  company: String,
  desc: String,
  to: String,
  from: String,
  image: String,
  current: Boolean,
})

const Experience = mongoose.model("Experience", experience)
module.exports = Experience
