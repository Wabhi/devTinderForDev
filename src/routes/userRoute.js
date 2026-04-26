const express = require("express");
const { userJwTokenMiddleware } = require("../middlewares/Auth");
const ConnectionRequest = require("../modals/connectionRequest");
const User = require("../modals/users"); // ✅ was missing
const userRoute = express.Router();

// get all received connection requests
userRoute.get(
  "/user/requests/received",
  userJwTokenMiddleware,
  async (req, res) => {
    try {
      const loggedInUserId = req.user._id;

      const connectionRequests = await ConnectionRequest.find({
        toUserId: loggedInUserId,
        status: "interested",
      }).populate("fromUserId", [
        "firstName",
        "lastName",
        "email",
        "photoUrl",
        "skills",
        "about",
      ]);

      res.status(200).json({
        success: true,
        message: "Connection requests fetched successfully",
        data: connectionRequests,
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

// get all accepted connections
userRoute.get("/user/connections", userJwTokenMiddleware, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUserId, status: "accepted" },
        { toUserId: loggedInUserId, status: "accepted" },
      ],
    }).populate("fromUserId toUserId", [
      "firstName",
      "lastName",
      "email",
      "photoUrl",
      "skills",
      "about",
    ]);

    const data = connections.map((connection) =>
      connection.fromUserId._id.toString() === loggedInUserId.toString()
        ? connection.toUserId
        : connection.fromUserId
    );

    res.status(200).json({
      success: true,
      message: "Connections fetched successfully",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
});

// get user feed — exclude logged-in user and all users with any connection request
userRoute.get("/user/feed", userJwTokenMiddleware, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // ✅ query params are read from req.query automatically
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
    });

    const hideUserFromFeed = new Set();
    hideUserFromFeed.add(loggedInUserId.toString());

    connectionRequests.forEach((request) => {
      hideUserFromFeed.add(request.fromUserId.toString());
      hideUserFromFeed.add(request.toUserId.toString());
    });

    const users = await User.find(
      {
        _id: {
          $nin: Array.from(hideUserFromFeed),
        },
      },
      ["firstName", "lastName", "email", "photoUrl", "skills", "about"]
    )
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "Feed fetched successfully",
      data: users,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
});

module.exports = userRoute;