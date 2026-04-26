const express = require("express");
const { userJwTokenMiddleware } = require("../middlewares/Auth");
const requestsRouter = express.Router();
const ConnectionRequest = require("../modals/connectionRequest");   
const User = require("../modals/users");


// sending connection request api for both interested and ignored status.
requestsRouter.post("/request/sent/:status/:toUserId", userJwTokenMiddleware, async (req, res) => {
try{
const fromUserId = req.user._id;
const toUserId = req.params.toUserId;
const status = req.params.status || "interested";
const allowedStatuses = ["ignored", "interested"];
if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values are: ${allowedStatuses.join(", ")}`,
    });
}

//check if a request already exists between these users
const existingRequest = await ConnectionRequest.findOne({
    $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
    ]
});
if (existingRequest) {
    return res.status(409).json({   
        success: false,
        message: "A connection request already exists between these users",
    });
}   

const toUser = await User.findById(toUserId);
if (!toUser) {
    return res.status(404).json({   
        success: false,
        message: "The user you are trying to connect with does not exist",
    });
}       


const newRequest = new ConnectionRequest({
    fromUserId,
    toUserId,
    status
});
await newRequest.save();

res.status(201).json({
    success: true,
    message: "Connection request sent successfully",
    data: newRequest
});
}catch(err){
    res.status(500).json({
        success: false,
        message: "Internal server error",
        error: err.message,
      });   
}
})

// reviewing connection request api for both accepted and rejected status.
requestsRouter.post("/request/review/:status/:toRequestId", userJwTokenMiddleware, async (req, res) => {
   try{
    const loggedInUserId = req.user._id;
    const {status, toRequestId} = req.params;
    const allowedStatuses = ["accepted", "rejected"];
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: `Invalid status. Allowed values are: ${allowedStatuses.join(", ")}`,
        });
    }
    const connectionRequest = await ConnectionRequest.findOne({_id: toRequestId, toUserId: loggedInUserId, status: "interested"});
    if (!connectionRequest) {
        return res.status(404).json({
            success: false,
            message: "Connection request not found or already reviewed",
        });
    }

    connectionRequest.status = status;
    await connectionRequest.save();
    res.status(200).json({
        success: true,
        message: `Connection request ${status} successfully`,
        data: connectionRequest
    });

   }catch(err){
    res.status(500).json({
        success: false,
        message: "Internal server error",
        error: err.message,
      });   
   }
})

module.exports = requestsRouter;
