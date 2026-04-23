const express = require("express");
// require("../src/configs/database")
const connectToDb = require("../src/configs/database");
const User = require("./modals/users");
const app = express();

//signup user api.
app.post("/signup", async (req, res) => {
  try {
    const userObject = {
      firstName: "Abhishessk2",
      lastName: "Tiwari2",
      email: "tiwariabhishek2@gmail.com",
      phoneNumber: "+91-9876543210",
      password: "Rahul@1234",
      confirmPassword: "Rahul2@1234",
      age: 28,
      gender: "Male",
      city: "Bengaluru",
      hobbies: ["Cricket", "Reading", "Travelling"],
      dob: "1996-04-15",
    };

    const user = new User(userObject);
    await user.save();

    res.status(201).json({
      success: true,
      message: "User is successfully added in database",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add user in database",
      error: error.message,
    });
  }
});

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
