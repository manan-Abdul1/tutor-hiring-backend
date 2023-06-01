const mongoose = require("mongoose")

const user = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
  type: String,
  twitterLink: String,
  discordLink: String,
  avatar: String,
  summary: String,
  about: String,
  banner: String,
  communityBlockchain: Array,
  experienceCount: String,
  skillDeveloper: Boolean,
  skillArtist: Boolean,
  skillManager: Boolean,
  skillModerator: Boolean,
  skillMarketer: Boolean,
  skillAlphaHunter: Boolean,
  skillOther: Boolean,
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  dislikes: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
})

const User = mongoose.model("User", user)
module.exports = User
