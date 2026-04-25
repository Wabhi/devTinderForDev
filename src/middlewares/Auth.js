const jwt = require("jsonwebtoken");
const User = require("../modals/users");
const adminAuthMiddleware = (req, res, next) => {
  const token = "admin";
  const isAdmin = token === "admin";
  if (!isAdmin) {
    res.status(401).send("Unauthorized Request for admin!!!!!!!!!!!!!!!");
  } else {
    next();
  }
};

const userAuthMiddleware = (req, res, next) => {
  const token = "user";
  const isUser = token === "user";
  if (!isUser) {
    res.status(401).send("Unauthorized Request for user!!!!!!!!!!!!!!!!");
  } else {
    next();
  }
};

const userJwTokenMiddleware = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if(!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }
    const decoded = jwt.verify(token, "your_jwt_secret_key");
    const { _id } = decoded;
    const user = await User.findById(_id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    } else {
      req.user = user; // ✅ attach the user object to the request
      next();
    }
  } catch (err) {
    res
      .status(401)
      .json({ success: false, message: "Unauthorized: Invalid token" });
  }
};

module.exports = {
  adminAuthMiddleware,
  userAuthMiddleware,
  userJwTokenMiddleware,
};
