const mongoose = require("mongoose");
const User = require("../model/userModel");

exports.connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Database connected successfully");

  const isAdminExist = await User.findOne({ userEmail: "admin@gmail.com" });
  if (!isAdminExist) {
    await User.create({
      userEmail: "admin@gmail.com",
      userPassword: "admin",
      userPhoneNumber: 9845201563,
      userName: "admin",
    });
    console.log("admin seeded successfully");
  } else {
    console.log("Admin already seeded");
  }
};
