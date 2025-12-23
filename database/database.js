const mongoose = require("mongoose");
const User = require("../model/userModel");
const adminSeeder = require("../adminSeeder");

exports.connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Database connected successfully");

  adminSeeder();
};
