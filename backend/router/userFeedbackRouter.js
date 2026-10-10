
const express = require("express");
const jwt = require("jsonwebtoken");
const Feedback = require("../models/userFeedback");
const CrimeReport = require("../models/crimeReport");

const router = express.Router();

// VERIFY TOKEN
function verifyToken(req, res, next) {
  const token = req.headers.token;

  try {
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized request",
      });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (payload.role !== "user") {
      return res.status(403).json({
        message: "User access required",
      });
    }

    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

// SUBMIT FEEDBACK
router.post("/:id", verifyToken, async (req, res) => {
  try {
    const { feedbackDetails } = req.body;

    // CHECK FEEDBACK DETAILS
    if (
      typeof feedbackDetails !== "string" ||
      feedbackDetails.trim() === ""
    ) {
      return res.status(400).json({
        message: "Feedback details are required",
      });
    }

    // FIND CASE BELONGING TO THE LOGGED-IN USER
    const report = await CrimeReport.findOne({
      caseId: req.params.id,
      userId: req.user.id,
    });

    if (!report) {
      return res.status(404).json({
        message: "Case not found",
      });
    }

    // CHECK CASE STATUS
    if (report.currentStatus !== "Resolved") {
      return res.status(400).json({
        message: "Feedback can be submitted only for resolved cases",
      });
    }

    // CHECK WHETHER FEEDBACK WAS ALREADY SUBMITTED
    const existingFeedback = await Feedback.findOne({
      caseId: report._id,
      userId: req.user.id,
    });

    if (report.feedbackSubmitted || existingFeedback) {
      return res.status(400).json({
        message: "Feedback has already been submitted for this case",
      });
    }

    // CREATE FEEDBACK
    const feedback = new Feedback({
      caseId: report._id,
      userId: req.user.id,
      feedbackDetails: feedbackDetails.trim(),
      submittedDateTime: new Date(),
    });

    await feedback.save();

    // MARK FEEDBACK AS SUBMITTED
    report.feedbackSubmitted = true;
    await report.save();

    return res.status(201).json({
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    // HANDLE DUPLICATE FEEDBACK IF A UNIQUE INDEX EXISTS
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Feedback has already been submitted for this case",
      });
    }

    return res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
