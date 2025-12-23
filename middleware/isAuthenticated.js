const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../model/userModel");

const isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(403).json({
      message: "Please login",
    });
  }

  const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);
  if (!decoded) {
    return res.status(403).json({
      message: "Please don't try to do this",
    });
  }
  const userExist = await User.findOne({ _id: decoded.id });
  if (!userExist) {
    return res.status(404).json({
      message: "User doesnot exist with that token",
    });
  }
  req.user = userExist;
  next();
};
module.exports = isAuthenticated;
