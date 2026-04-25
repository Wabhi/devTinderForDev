const express = require("express");
const { userJwTokenMiddleware } = require("../middlewares/Auth");
const requestsRouter = express.Router();

// sending connection request api
requestsRouter.post("/connection-request", userJwTokenMiddleware, async (req, res) => {
  const user = req.user; // ✅ get the user object from the request
  console.log("Received connection request with data:", req.body); // ✅ log the incoming request data
  res.send("connection request sent successfully!!!!!!!!!!", user.firstName);
})

module.exports = requestsRouter;
