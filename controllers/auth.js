const User = require("../models/user");
const dotenv=require("dotenv").config()
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res, next) => {
  try {
    const { email, name, password, mobile } = req.body;
    if (
      !email?.trim() ||
      !name?.trim() ||
      !password?.trim() ||
      !mobile?.trim()
    ) {
      return res.status(422).json({ message: "Please fill all fields" });
    }

    const isUserExist = await User.findOne({ email: email.toLowerCase() });
    if (isUserExist) {
      return res.json({ message: "user is already registered" });
    }
    const hashedPwd = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      email:email.toLowerCase(),
      name,
      password: hashedPwd,
      mobile,
    });

    res.status(201).json({
      message: "user registered successfully",
      user: { email: newUser.email, _id: newUser._id, name: newUser.name },
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  // res.send("login");
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password?.trim()) {
      return res.status(422).json({ message: "Please fill all fields" });
    }
    const user = await User.findOne({ email:email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      return res
        .status(403)
        .json({ message: "Credentials are invalid, Authentication failed" });
    }
    const token = jwt.sign(
      { email: user.email, userId: user._id},
      process.env.PRIVATE_KEY,
      { expiresIn: "240h" }
    );
    res.status(200).json({
      message: "login successful",
      token: token,
      userId: user._id,
      email: user.email,
    });
  } catch (err) {
    next(err);
  }
};
