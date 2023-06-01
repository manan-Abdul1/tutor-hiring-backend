const router = require("express").Router()
const Helpers = require("../helpers/functions")
const User = require("../models/users")
const Review = require("../models/review")
const verifyJwtAndUser = require("../middlewares/verifyUserAndJwt")

// ------- add
router.post("/api/v1/add-review", verifyJwtAndUser, async (req, res) => {
  const newReview = new Review({
    to: req.body.to,
    from: req.user._id,
    rating: req.body.rating,
    desc: req.body.desc,
  })
  await newReview.save()

  res.status(200).json({ status: 200, message: "Reviewed Successfully" })
})

// ------- update
router.put("/api/v1/update-review", verifyJwtAndUser, async (req, res) => {
  let checkReview = await Review.findOne({
    to: req.body.to,
    from: req.user._id,
  })

  if (checkReview) {
    // user already reviewed
    await Review.updateOne(
      { _id: req.body.id },
      {
        $set: {
          rating: req.body.rating,
          desc: req.body.desc,
        },
      },
    )

    res.status(200).json({ status: 200, message: "Update Successful" })
  } else {
    res.status(200).json({ status: 404, message: "Cannot Review." })
  }
})

// ------- profile rating
router.get("/api/v1/profile-rating", verifyJwtAndUser, async (req, res) => {
  let data = await Review.find({ to: req.body.to })
  let sum = 0

  for (let i = 0; i < data.length; i++) {
    sum += parseInt(data[i].rating)
  }
  let avg = sum / data.length

  res.status(200).json({ status: 200, data: avg })
})

// ------- get Reviews
router.get("/api/v1/reviews/:id", verifyJwtAndUser, async (req, res) => {
  const data = await Review.find({ to: req.params.id }).populate("from")
  res.status(200).json({ status: 200, data })
})

module.exports = router
