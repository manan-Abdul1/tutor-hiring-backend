const router = require("express").Router()
const Helpers = require("../helpers/functions")
const User = require("../models/users")
const verifyJwtAndUser = require("../middlewares/verifyUserAndJwt")

//------- authorize user
router.post("/api/v1/authenticate", async (req, res) => {
  const checkUser = await Helpers.findUserByEmail(req.body.email)
  if (checkUser === null) {
    res.status(404).json({ status: 404 })
  } else {
    if (checkUser.type == "user") {
      let jwtToken = Helpers.generateJwtToken(checkUser._id)
      Helpers.setUserData(checkUser)
      res
        .status(200)
        .json({
          status: 200,
          message: "Login Successfully",
          user: checkUser,
          token: jwtToken,
        })
    } else {
      res.status(401).json({ status: 401, message: "Unauthorized Request" })
    }
  }
})

//------- register user
router.post("/api/v1/register", async (req, res) => {
  let user = await User.findOne({ email: req.body.email })
  if (user)
    return res.status(409).json({ status: 409, message: "Already registered" })

  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    avatar: req.body.avatar,
    role: "1",
    type: "user",
    summary: "",
    about: "",
    twitterLink: "",
    discordLink: req.body.discordLink,
    banner: null,
    likeCount: "0",
    experienceCount: "0",
    skillArtist: req.body.skillArtist,
    skillDeveloper: req.body.skillDeveloper,
    skillModerator: req.body.skillModerator,
    skillManager: req.body.skillManager,
    skillMarketer: req.body.skillMarketer,
    skillAlphaHunter: req.body.skillAlphaHunter,
    skillOther: req.body.skillOther,
  })

  user = await newUser.save()

  let jwtToken = Helpers.generateJwtToken(user._id)
  Helpers.setUserData(newUser)
  res
    .status(200)
    .json({ status: 200, message: "Login successfully", user, token: jwtToken })
})

//------- all users
router.get("/api/v1/all-users", async (req, res) => {
  const data = await User.find()
  res.status(200).json({ status: 200, data: data })
})

//------- user by id
router.get("/api/v1/user/:id", async (req, res) => {
  const data = await Helpers.findUserById(req.params.id)
  res.status(200).json({ status: 200, data: data })
})

//------- update profile
router.put("/api/v1/update-profile",verifyJwtAndUser, async (req, res) => {
  await User.updateOne(
    { _id: req.body.id },
    {
      $set: {
        name: req.body.name,
        summary: req.body.summary,
        about: req.body.about,
        twitterLink: req.body.twitterLink,
        skillArtist: req.body.skillArtist,
        skillDeveloper: req.body.skillDeveloper,
        skillModerator: req.body.skillModerator,
        skillManager: req.body.skillManager,
        skillMarketer: req.body.skillMarketer,
        skillAlphaHunter: req.body.skillAlphaHunter,
        skillOther: req.body.skillOther,
        communityBlockchain: req.body.communityBlockchain,
      },
    },
  )
  res
    .status(200)
    .json({ status: 200, message: "Profile updated Successfully!" })
})

//------- save banner image
router.put("/api/v1/save-banner",verifyJwtAndUser, async (req, res) => {
  if (!req.files?.banner)
    return res
      .status(400)
      .json({ status: 400, message: "Banner file Required" })

  let user = await Helpers.findUserById(req.body.id)
  if (user.banner) {
    await Helpers.deleteBannerImage(user.banner)
  }

  let fileName = Helpers.saveBannerImage(req.files?.banner)
  await User.updateOne(
    { _id: req.body.id },
    {
      $set: {
        banner: `${req.protocol}://${req.get("host")}/banner/${fileName}`,
      },
    },
  )
  res.status(200).json({ status: "200", message: "Banner saved successfully" })
})

module.exports = router
