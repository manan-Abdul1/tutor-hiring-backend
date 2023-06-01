const router = require("express").Router()
const User = require("../models/users")
const verifyJwtAndUser = require("../middlewares/verifyUserAndJwt")

// ------- like
router.post(
  "/api/v1/like-dislike-profile",
  verifyJwtAndUser,
  async (req, res) => {
    try {
      const user = await User.findById(req.body.to)
      if (!user) return json(res, 404, "User not Found")

      if (req.body.type === "like") {
        if (!user.likes.includes(req.user._id)) {
          await user.updateOne({ $push: { likes: req.user._id } })
          await user.updateOne({ $pull: { dislikes: req.user._id } })
        }
        res.status(200).json({ status: 200, message: "user like" })
      } else if (req.body.type === "dislike") {
        if (!user.dislikes.includes(req.user._id)) {
          await user.updateOne({ $push: { dislikes: req.user._id } })
          await user.updateOne({ $pull: { likes: req.user._id } })
        }
        res.status(200).json({ status: 200, message: "user dislike" })
      }
    } catch (error) {
      res.status(200).json({ status: 500, message: error.message })
    }
  },
)

module.exports = router
