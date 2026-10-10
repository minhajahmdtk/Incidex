
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
      trim: true,
    },

    description: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 500,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    latitude: {
      type: Number,
      default: null,
    },

    longitude: {
      type: Number,
      default: null,
    },

    currentStatus: {
      type: String,
      enum: ["New", "Acknowledged", "In Progress", "Resolved"],
      default: "New",
      required: true,
    },

    // Feedback submission tracking
    feedbackSubmitted: {
      type: Boolean,
      default: false,
    },

    // Resolution details
    finalDetails: {
      type: String,
      default: "",
      trim: true,
    },

    actionTaken: {
      type: String,
      default: "",
      trim: true,
    },

    resolutionDetails: {
      type: String,
      default: "",
      trim: true,
    },

    // Fake-report and fine details
    isFakeReport: {
      type: Boolean,
      default: false,
    },

    fakeReportReason: {
      type: String,
      default: "",
      trim: true,
    },

    fineAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    fineStatus: {
      type: String,
      enum: [
        "Pending",
        "Appealed",
        "Upheld",
        "Paid",
        "Cancelled",
      ],
      default: "Pending",
    },

    // Appeal details
    appealReason: {
      type: String,
      default: "",
      trim: true,
    },

    appealStatus: {
      type: String,
      enum: [
        "Not Appealed",
        "Pending",
        "Approved",
        "Rejected",
      ],
      default: "Not Appealed",
    },

    appealReviewedAt: {
      type: Date,
      default: null,
    },

    // Razorpay payment tracking
    razorpayOrderId: {
      type: String,
      default: null,
    },

    razorpayPaymentId: {
      type: String,
      default: null,
    },

    finePaidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CrimeReport", crimeReportSchema);
