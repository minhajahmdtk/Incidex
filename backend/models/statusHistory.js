const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CrimeReport",
      required: true,
    },

    status: {
      type: String,
      required: true,
      enum: [
        "New",
        "Acknowledged",
        "In Progress",
        "Resolved",
      ],
    },

    updatedDateTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("StatusHistory", statusHistorySchema);