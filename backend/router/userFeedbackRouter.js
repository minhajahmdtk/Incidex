const express = require('express');
const jwt = require('jsonwebtoken');
const Feedback = require('../models/userFeedback');
const CrimeReport = require('../models/crimeReport');

const router = express.Router();

// VERIFY TOKEN
function verifyToken(req, res, next) {
  const token = req.headers.token;

  try {
    if (!token) {
      return res.status(401).json({
        message: 'Unauthorized request',
      });
    }

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (payload.role != "user") {
      return res.status(404).json({
        message: 'User access required'
      });
    }

    req.user = payload;
    next();

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

// SUBMIT FEEDBACK
router.post("/:id", verifyToken, async (req, res) => {
  try {
    const { feedbackDetails } = req.body;

    // CHECK FEEDBACK
    if (!feedbackDetails || feedbackDetails.trim() === "") {
      return res.status(400).json({
        message: "Feedback details are required",
      });
    }

    // FIND CASE
    const Report = await CrimeReport.findOne({
      caseId: req.params.id,
      userId: req.user.id,
    });

    if (!Report) {
      return res.status(404).json({
        message: "Case not found",
      });
    }

    // CHECK CASE STATUS
    if (Report.currentStatus !== "Resolved") {
      return res.status(400).json({
        message: "Feedback can be submitted only for resolved cases",
      });
    }

    // CHECK WHETHER FEEDBACK ALREADY SUBMITTED
    if (Report.feedbackSubmitted) {
      return res.status(400).json({
        message: "Feedback has already been submitted for this case",
      });
    }

    // CREATE FEEDBACK
    const feedback = new Feedback({
      caseId: Report._id,
      userId: req.user.id,
      feedbackDetails: feedbackDetails.trim(),
      submittedDateTime: new Date(),
    });

    await feedback.save();

    // MARK FEEDBACK AS SUBMITTED
    Report.feedbackSubmitted = true;

    await Report.save();

    return res.status(201).json({
      message: "Feedback submitted successfully",
      feedback: feedback,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;