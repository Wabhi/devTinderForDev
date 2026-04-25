const express = require("express");
const connectToDb = require("../src/configs/database");
const User = require("./modals/users");
const app = express();
const {
  validateUserDataOnSignUp,
  validateUserDataOnLogin,
} = require("../src/utils/validation"); 
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userJwTokenMiddleware } = require("./middlewares/Auth");

app.use(express.json());
app.use(cookieParser());

// signup user api
app.post("/signup", async (req, res) => {
  try {
    // Step 1: Validate request body
    const { isValid, errors } = validateUserDataOnSignUp(req.body); // ✅
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
app.post("/login", async (req, res) => {
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
      const token = jwt.sign({ _id: user._id }, "your_jwt_secret_key", {
        expiresIn: "7d",
      });
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

// feed user api
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong!!!!!!!!!!");
  }
});

// delete a user
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findByIdAndDelete({ _id: userId });
    res.send("User deleted successfully !!!!!!!!!!");
  } catch (err) {
    res.status(400).send("Something went wrong!!!!!!!!!!");
  }
});

// update user data
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("User data is successfully updated!!!!!!");
  } catch (err) {
    res.status(400).send("Something went wrong!!!!!!!!!!");
  }
});

// profile user api
app.get("/profile", userJwTokenMiddleware, async (req, res) => {
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

// sending connection request api
app.post("/connection-request", userJwTokenMiddleware, async (req, res) => {
  const user = req.user; // ✅ get the user object from the request
  console.log("Received connection request with data:", req.body); // ✅ log the incoming request data
  res.send("connection request sent successfully!!!!!!!!!!", user.firstName);
})

connectToDb()
  .then(() => {
    console.log("Database is successfully connected !!!!!!!!!");
    app.listen(3030, () => {
      console.log("Server is running on port 3030");
    });
  })
  .catch((error) => {
    console.log("Database is not successfully connected !!!!!!!!");
  });
