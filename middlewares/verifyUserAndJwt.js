const jwt = require("jsonwebtoken")
const User = require("../models/users")

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (token == null) {
    return res.status(403).json({ status: 403, message: "Forbidden Request" })
  }
  const decode = jwt.verify(token, process.env.JWT_SECRET)
  req.user = await User.findById(decode._id)

  next()
}

module.exports = authenticateToken
