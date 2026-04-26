const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender user ID is required"],
    },

    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Receiver user ID is required"],
    },

    status: {
      type: String,
      required: [true, "Status is required"],
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: '"{VALUE}" is not a valid status',
      },
      default: "interested",
    },
  },
  { timestamps: true }
);

// ✅ Compound index
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

// ✅ Pre-save hook — no next parameter, just throw error directly
connectionRequestSchema.pre("save", function () {
  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("You cannot send a connection request to yourself");
  }
});

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);
module.exports = ConnectionRequest;