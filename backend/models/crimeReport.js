const mongoose = require("mongoose");

const crimeReportSchema = new mongoose.Schema(
  {
    caseId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    crimeCategory: {
      type: String,
      required: true,
      enum: [
        "Theft",
        "Fraud",
        "Cybercrime",
        "Assault",
        "Vandalism",
        "Missing Person",
        "Accident",
        "Other",
      ],
    },

    incidentDescription: {
      type: String,
      required: true,
    },

    incidentLocation: {
      type: String,
      required: true,
      trim: true,
    },

    latitude: {
      type: Number,
      min: -90,
      max: 90,
    },

    longitude: {
      type: Number,
      min: -180,
      max: 180,
    },

    reportDateTime: {
      type: Date,
      required: true,
      default: Date.now,
    },

    currentStatus: {
      type: String,
      required: true,
      enum: [
        "New",
        "Acknowledged",
        "In Progress",
        "Resolved",
      ],
      default: "New",
    },

    finalDetails: {
      type: String,
      default: "",
    },

    actionTaken: {
      type: String,
      default: "",
    },

    resolutionDetails: {
      type: String,
      default: "",
    },

    feedbackSubmitted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CrimeReport", crimeReportSchema);