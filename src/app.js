const express = require("express");
const connectToDb = require("../src/configs/database");
const User = require("../src/modals/users");
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

const authRouter = require("./routes/authRoute");
const profileRouter = require("./routes/profileRoute"); 
const requestsRouter = require("./routes/requestsRoute");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);    


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
