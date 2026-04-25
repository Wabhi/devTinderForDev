const express = require("express");
const { userJwTokenMiddleware } = require("../middlewares/Auth");
const profileRouter = express.Router();

// profile user api
profileRouter.get("/profile", userJwTokenMiddleware, async (req, res) => {
  try {
    const user = req.user; // ✅ get the user object from the request
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.send("This is profile page", user);
  } catch (err) {
    res.status(400).send("Something went wrong!!!!!!!!!!");
  }
});

module.exports = profileRouter;