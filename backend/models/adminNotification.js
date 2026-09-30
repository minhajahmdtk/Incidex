const mongoose = require("mongoose");

const adminNotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },

    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CrimeReport",
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    createdDateTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AdminNotification",adminNotificationSchema);