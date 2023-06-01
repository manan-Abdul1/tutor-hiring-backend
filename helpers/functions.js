const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
var fs = require("fs")

// Global Variables
let user = null

// Models
const User = require("../models/users")

// Encrypt Password
module.exports.encryptPassword = function (data) {
  return bcrypt.hashSync(data, 5)
}

// Compare encrypt password
module.exports.compareEncryptedPassword = function (
  orignalPassword,
  hashPassword,
) {
  return bcrypt.compareSync(orignalPassword, hashPassword)
}

// Generate JWT token
module.exports.generateJwtToken = function (data) {
  return jwt.sign({ _id: data }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })
}

// set login data
module.exports.setUserData = function (data) {
  user = data
  return
}

// get login data
module.exports.getUserData = function () {
  return user
}

// Find User by email
module.exports.findUserByEmail = function (email) {
  return User.findOne({ email: email })
}

// Find User by id
module.exports.findUserById = function (id) {
  return User.findOne({ _id: id })
}

// save banner image
module.exports.saveBannerImage = function (filename) {
  let file = filename
  let fileName =
    Math.floor(100000000000000000 + Math.random() * 999999999999999999) +
    file.name

  file.mv("public/banner/" + fileName, (err) => {
    if (err) {
      console.log(err)
    }
  })

  return fileName
}

// delete image
module.exports.deleteBannerImage = async function (fileName) {
  await fs.unlink(
    "public/banner/" + fileName.slice(fileName.lastIndexOf("/") + 1),
    function (err) {},
  )
}
// save banner image
module.exports.saveProjectImage = function (filename) {
  let file = filename
  let fileName =
    Math.floor(100000000000000000 + Math.random() * 999999999999999999) +
    file.name

  file.mv("public/projects/" + fileName, (err) => {
    if (err) {
      console.log(err)
    }
  })

  return fileName
}

// delete image
module.exports.deleteProjectImage = async function (fileName) {
  await fs.unlink(
    "public/projects/" + fileName.slice(fileName.lastIndexOf("/") + 1),
    function (err) {},
  )
}
