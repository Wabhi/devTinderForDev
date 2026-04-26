const express = require("express");
const { validateUserDataOnSignUp } = require("../utils/validation");
const User = require("../modals/users");
const { userJwTokenMiddleware } = require("../middlewares/Auth");
const authRouter = express.Router();

// signup user api
authRouter.post("/signup", async (req, res) => {
console.log("Received signup request with data:", req.body); // ✅ log the incoming request data
  try {
    // Step 1: Validate request body
    const { isValid, errors } = validateUserDataOnSignUp(req.body); 
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    // Step 2: Check duplicate email
    const existingEmail = await User.findOne({ email: req.body.email });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    // Step 3: Check duplicate phone
    const existingPhone = await User.findOne({
      phoneNumber: req.body.phoneNumber,
    });
    if (existingPhone) {
      return res.status(409).json({
        success: false,
        message: "Phone number is already registered",
      });
    }

    // Step 4: Save user — pre-save hook handles hashing
    const user = new User(req.body);
    await user.save();

    // Step 5: Exclude password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: userResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// login user api
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email",
      });
    }
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    } else {
      //create jwt token here and send to client
      const token = await user.getJWTToken();
      console.log("Generated JWT token:", token); // ✅ log the generated token

      res.cookie("token", token);
      const userResponse = user.toObject();
      delete userResponse.password;
      res.status(200).json({
        success: true,
        message: "Login successful",
        data: userResponse,
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
});

// logout user api
authRouter.post("/logout", userJwTokenMiddleware, async (req, res) => {  
  try{
    res.cookie("token", null, { expires: new Date(0) }); // Clear the token cookie
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
});

module.exports = authRouter;

// This file is currently empty because all authentication-related routes are defined directly in src/app.js for simplicity. 
// If you want to modularize your routes further, you can move the signup and login route handlers from src/app.js to this authRoute.js file and then import this router into src/app.js.   