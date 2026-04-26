const express = require("express");
const { userJwTokenMiddleware } = require("../middlewares/Auth");
const { validateUserDataOnProfileEdit } = require("../utils/validation");
const User = require("../modals/users"); 
const profileRouter = express.Router();

// profile view user api
profileRouter.get(
  "/profile/view",
  userJwTokenMiddleware,
  async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      res.status(200).json({
        success: true,
        message: "User profile retrieved successfully",
        data: user,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: err.message,
      });
    }
  }
);

// profile update user api
profileRouter.patch(
  "/profile/edit",
  userJwTokenMiddleware,
  async (req, res) => {
    try {
      if (!validateUserDataOnProfileEdit(req)) {
        return res.status(400).json({
          success: false,
          message: "Invalid fields in profile edit data",
        });
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $set: req.body },
        {
          new: true,
          runValidators: true,
        }
      ).select("-password -confirmPassword");

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        message: `${updatedUser.firstName} User profile updated successfully`,
        data: updatedUser,
      });

    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: err.message,
      });
    }
  }
);

module.exports = profileRouter;