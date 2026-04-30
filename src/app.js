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
const cors = require("cors");
const authRouter = require("./routes/authRoute");
const profileRouter = require("./routes/profileRoute");
const requestsRouter = require("./routes/requestsRoute");
const userRoute = require("./routes/userRoute");


app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173", // ✅ allow requests from frontend
  credentials: true, // ✅ allow cookies to be sent
}));
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);
app.use("/", userRoute); 

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