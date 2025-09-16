const jwt = require("jsonwebtoken");
const User =require('../model/users');
const loginToken =require('../model/loginToken');

const verifyToken = async (req, res, next) => {
  const token = req.header("Authorization");
 
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }
  try {
     const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const tokenExists = await loginToken.findOne({ token });{
      if(!tokenExists){
        return res.status(401).json({success:false,message:"Token expired or logged out. Please log in again."})
      }
    }
    req.user = decoded;  
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};
module.exports = verifyToken;
