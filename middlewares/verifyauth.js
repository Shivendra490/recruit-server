const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
exports.verifyAuth = (req, res, next) => {
  try {
    
    let token = req.headers.authorization;
    
    if (!token) {
      res.status(403).status({ message: "Invalid Token" });
    }
    let decodedToken = jwt.verify(token, process.env.PRIVATE_KEY);

    req.userId = decodedToken.userId;

    next();
  } catch (err) {
    res
      .status(400)
      .json({ message: "Invalid Token,unauthorized access", error: err });
  }
};
