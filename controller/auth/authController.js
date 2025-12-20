const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const User = require("../../model/userModel");
const sendEmail = require("../../services/sendEmail");

exports.registerUser = async (req, res) => {
  const { email, password, phoneNumber, userName } = req.body;
  if (!email || !password || !phoneNumber || !userName) {
    return res.status(404).json({
      message: "Please provide all the details",
    });
  }

  //check if the email already exist or not
  const userFound = await User.find({ userEmail: email });
  if (userFound.length > 0) {
    return res.status(400).json({
      message: "User with that email already exist",
    });
  }
  const user = await User.create({
    userEmail: email,
    userPassword: bcrypt.hashSync(password, 10),
    userPhoneNumber: phoneNumber,
    userName,
  });
  res.status(201).json({
    message: "User created successfully",
    data: user,
  });
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Please enter Email and Password",
    });
  }
  //check whether that email exist or not
  const userFound = await User.find({ userEmail: email });
  if (userFound.length == 0) {
    return res.status(404).json({
      message: "Email not registered",
    });
  }
  //check whether the password is correct or not

  const isPasswordMatched = bcrypt.compareSync(
    password,
    userFound[0].userPassword
  );
  if (isPasswordMatched) {
    const token = jwt.sign({ id: userFound[0]._id }, process.env.SECRET_KEY, {
      expiresIn: "30d",
    });
    res.status(200).json({
      message: "User logged in Successfully",
      token,
    });
  } else {
    res.status(400).json({
      message: "Invalid credentials",
    });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      message: "Please provide valid email address",
    });
  }
  const userExist = await User.find({ userEmail: email });
  if (userExist.length == 0) {
    return res.status(400).json({
      message: "User doesnot exist with this email address",
    });
  }
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
  userExist[0].otp = otp;
  await userExist[0].save();
  await sendEmail({
    email,
    subject: "Your OTP for Digital MOMO ",
    message: `Your OTP for Digital MOMO is ${otp}.Don't share with anyone.`,
  });
  res.status(200).json({
    message: "OTP Email sent successfully",
  });
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(200).json({
      message: "Please provide email and otp",
    });
  }
  const userExists = await User.find({ userEmail: email });
  if (userExists.length == 0) {
    return res.status(400).json({
      message: "Email is not registered",
    });
  }
  if (userExists[0].otp != otp) {
    res.status(400).json({
      message: "Please enter correct Otp",
    });
  } else {
    userExists[0].otp = undefined;
    userExists[0].isOtpVerified = true;
    await userExists[0].save();
    res.status(200).json({
      message: "Otp is correct",
    });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;
  if (!email || !newPassword || !confirmPassword) {
    return res.status(400).json({
      message: "Please enter email,New password and confirm Password",
    });
  }
  if (confirmPassword != newPassword) {
    return res.status(400).json({
      message: "Confirm password and new Password doesnot matched",
    });
  }
  const userExists = await User.find({ userEmail: email });
  if (userExists.length == 0) {
    return res.status(400).json({
      message: "Email is not registered",
    });
  }
  if (userExists[0].isOtpVerified != true) {
    return res.status(400).json({
      message: "You cannot perform this action",
    });
  }
  userExists[0].isOtpVerified = false;
  userExists[0].userPassword = bcrypt.hashSync(newPassword, 10);
  await userExists[0].save();
  res.status(200).json({
    message: "Password reset successfully",
  });
};
