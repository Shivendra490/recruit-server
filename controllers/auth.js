const User = require("../models/user");

const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken")

exports.signUp = async (req, res, next) => {
  try {
    const { email, name, password, mobile } = req.body;
    if (
      !email?.trim() ||
      !name?.trim() ||
      !password?.trim() ||
      !mobile?.trim()
    ) {
      const error = new Error("All field are required");
      error.statusCode = 422;
      throw error;
    }

    const isUserExist = await User.findOne({ email: email });
    if (isUserExist) {
      return res.json({ message: "user is already registered" });
    }
    const hashedPwd = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      email,
      name,
      password: hashedPwd,
      mobile,
    });

    res.status(201).json({
      message: "user registered successfully",
      user: { email: newUser.email, _id: newUser._id, name: newUser.name },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  // res.send("login");
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password?.trim()) {
      const error = new Error("All field are required");
      error.statusCode = 422;
      throw error;
    }
    const user=await User.findOne({email})
    if(!user){
      const error = new Error("Credentials are invalid");
      error.statusCode = 401;
      throw error;
    }
    const isEqual=await bcrypt.compare(password,user.password)
    if(!isEqual){
      const error = new Error("Credentials are invalid,unauthorized access");
      error.statusCode = 401;
      throw error;
    }
    const token=jwt.sign({email:user.email,userId:user._id.toString()},'supersecretkey',{expiresIn:'1h'})
    res.status(200).json({message:"login successful",token:token,userId:user._id,email:user.email})
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
