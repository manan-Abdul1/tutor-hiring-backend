const router = require("express").Router()
const Helpers = require("../helpers/functions")
const Experience = require("../models/experience")
const User = require("../models/users")
const verifyJwtAndUser = require("../middlewares/verifyUserAndJwt")

// ------- add
router.post("/api/v1/add-experience", verifyJwtAndUser, async (req, res) => {
  let fileName = null
  if (req.files?.image) {
    fileName = Helpers.saveProjectImage(req.files?.image)
  }

  const newExp = new Experience({
    user: req.user._id,
    company: req.body.company,
    desc: req.body.desc,
    to: req.body.to,
    from: req.body.from,
    current: req.body.current,
    image: fileName
      ? `${req.protocol}://${req.get("host")}/projects/${fileName}`
      : null,
  })
  await newExp.save();

  let userData=await Helpers.findUserById(req.user._id)

  await User.updateOne(
      { _id: req.user._id },
      {
        $set: {
          experienceCount: (parseInt(userData.experienceCount) + 1),
        },
      },
  )

  res
    .status(200)
    .json({ status: 200, message: "Experience added Successfully" })
})

//------- by logged in user
router.get("/api/v1/experiences", verifyJwtAndUser, async (req, res) => {
  const data = await Experience.find({ user: req.user._id }).populate("user")
  res.status(200).json({ status: 200, data: data })
})

//------- by user id
router.get("/api/v1/experience/:id", verifyJwtAndUser, async (req, res) => {
  const data = await Experience.find({ user: req.params.id }).populate("user")
  res.status(200).json({ status: 200, data: data })
})

//------- delete
router.delete("/api/v1/experience/:id", verifyJwtAndUser, async (req, res) => {
  const experience = await Experience.findOne({ _id: req.params.id })
  if (experience?.image) {
    await Helpers.deleteProjectImage(experience?.image)
  }
  await Experience.deleteOne({ _id: req.params.id })

  let userData=await Helpers.findUserById(req.params.id)

  await User.updateOne(
      { _id: req.params.id },
      {
        $set: {
          experienceCount: (parseInt(userData.experienceCount) - 1),
        },
      },
  )

  res.status(200).json({ status: "200", message: "Delete successfully" })
})

//------- update
router.put("/api/v1/update-experience", verifyJwtAndUser, async (req, res) => {
  const experience = await Experience.findOne({ _id: req.body.id })
  let fileName = null

  if (req.files?.image) {
    if (experience?.image) {
      await Helpers.deleteProjectImage(experience?.image)
    }
    fileName = Helpers.saveProjectImage(req.files?.image)
  }

  await Experience.updateOne(
    { _id: req.body.id },
    {
      $set: {
        company: req.body.company,
        desc: req.body.desc,
        to: req.body.to,
        from: req.body.from,
        current: req.body.current,
        image: fileName
          ? `${req.protocol}://${req.get("host")}/projects/${fileName}`
          : null,
      },
    },
  )
  res.status(200).json({ status: 200, message: "Updated Successfully!" })
})

module.exports = router
