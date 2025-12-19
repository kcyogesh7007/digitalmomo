const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../model/userModel");
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
