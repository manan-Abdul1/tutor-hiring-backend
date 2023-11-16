const jwt = require("jsonwebtoken");

const createAuthorizationToken = (user) => jwt.sign({
    exp: Math.floor(Date.now() / 1000) + 7200, 
    data: { email: user.email, id: user._id }
}, process.env.JWT_SECRET);


const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
      return res.status(401).json({ message: "Auth Token Missing", ok: false });
    }
    try {
      const user = await jwt.verify(token, process.env.JWT_SECRET);
      if(user){
          next();
      }

    } catch (err) {
      console.error(err);
      return res.status(403).json({ message: "Unauthorized", ok: false });
    }
};
  
module.exports = ({
    verifyToken, 
    createAuthorizationToken
})