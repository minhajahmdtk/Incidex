const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const CrimeReport = require("../models/crimeReport");
const StatusHistory = require("../models/statusHistory");
const UserNotification = require("../models/userNotification");
const AdminNotification = require("../models/adminNotification");
const Feedback = require("../models/userFeedback");
const PDFDocument = require("pdfkit");
const transporter = require("../config/email");

const router = express.Router();

// VERIFY ADMIN TOKEN

function verifyAdmin(req, res, next) {
  const token = req.headers.token;

  try {
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized request",
      });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (payload.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    req.admin = payload;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

// VIEW ALL USERS

router.get("/users", verifyAdmin, async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      users,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

// VIEW SINGLE USER

router.get("/users/:id", verifyAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

// VIEW ALL CRIME CASES

router.get("/cases", verifyAdmin, async (req, res) => {
  try {
    const cases = await CrimeReport.find()
      .populate("userId", "name phone")
      .sort({ reportDateTime: -1 });

    return res.status(200).json({
      cases,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

// VIEW SINGLE CASE

router.get("/cases/:id", verifyAdmin, async (req, res) => {
  try {
    const report = await CrimeReport.findOne({
      caseId: req.params.id,
    }).populate("userId", "name email phone");

    if (!report) {
      return res.status(404).json({
        message: "Case not found",
      });
    }

    return res.status(200).json({
      case: report,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

// UPDATE CASE STATUS

router.patch("/cases/status/:id", verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (typeof status !== "string" || status.trim() === "") {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    const validStatuses = ["Acknowledged", "In Progress"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const report = await CrimeReport.findOne({
      caseId: req.params.id,
    });

    if (!report) {
      return res.status(404).json({
        message: "Case not found",
      });
    }

    const currentStatus = report.currentStatus;

    if (currentStatus === "Resolved") {
      return res.status(400).json({
        message: "Resolved cases cannot be updated",
      });
    }

    if (currentStatus === "New" && status !== "Acknowledged") {
      return res.status(400).json({
        message: "New case can only be changed to Acknowledged",
      });
    }

    if (
      currentStatus === "Acknowledged" &&
      status !== "In Progress"
    ) {
      return res.status(400).json({
        message: "Acknowledged case can only be changed to In Progress",
      });
    }

    report.currentStatus = status;

    await report.save();

    await StatusHistory.create({
      caseId: report._id,
      status,
      updatedDateTime: new Date(),
    });

    // CREATE USER NOTIFICATION

    await UserNotification.create({
      userId: report.userId,
      caseId: report._id,
      message: `Your case ${report.caseId} status has been updated to ${status}.`,
      isRead: false,
      createdDateTime: new Date(),
    });

    // SEND EMAIL NOTIFICATION

    try {
      const user = await User.findById(report.userId);

      if (user && user.email) {
        await transporter.sendMail({
          from: `"INCIDEX" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: `INCIDEX Case ${report.caseId} Status Update`,
          text: `Hello ${user.name},

Your INCIDEX case ${report.caseId} status has been updated.

Current Status: ${status}

Please log in to INCIDEX to view your case details.

Regards,
INCIDEX Team`,
        });

        console.log(`Email notification sent to ${user.email}`);
      }
    } catch (emailError) {
      console.error(
        "Email notification failed:",
        emailError.message
      );
    }

    return res.status(200).json({
      message: "Case status updated successfully",
      case: report,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

// RESOLVE CASE

router.patch("/cases/resolve/:id", verifyAdmin, async (req, res) => {
  try {
    const {
      finalDetails,
      actionTaken,
      resolutionDetails,
    } = req.body;

    if (
      typeof finalDetails !== "string" ||
      finalDetails.trim() === ""
    ) {
      return res.status(400).json({
        message: "Final details are required",
      });
    }

    if (
      typeof actionTaken !== "string" ||
      actionTaken.trim() === ""
    ) {
      return res.status(400).json({
        message: "Action taken is required",
      });
    }

    if (
      typeof resolutionDetails !== "string" ||
      resolutionDetails.trim() === ""
    ) {
      return res.status(400).json({
        message: "Resolution details are required",
      });
    }

    const report = await CrimeReport.findOne({
      caseId: req.params.id,
    });

    if (!report) {
      return res.status(404).json({
        message: "Case not found",
      });
    }

    if (report.currentStatus !== "In Progress") {
      return res.status(400).json({
        message: "Only In Progress cases can be resolved",
      });
    }

    report.currentStatus = "Resolved";
    report.finalDetails = finalDetails.trim();
    report.actionTaken = actionTaken.trim();
    report.resolutionDetails = resolutionDetails.trim();

    await report.save();

    await StatusHistory.create({
      caseId: report._id,
      status: "Resolved",
      updatedDateTime: new Date(),
    });

    // CREATE USER NOTIFICATION

    await UserNotification.create({
      userId: report.userId,
      caseId: report._id,
      message: `Your case ${report.caseId} has been resolved.`,
      isRead: false,
      createdDateTime: new Date(),
    });

    // SEND RESOLUTION EMAIL

    try {
      const user = await User.findById(report.userId);

      if (user && user.email) {
        await transporter.sendMail({
          from: `"INCIDEX" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: `INCIDEX Case ${report.caseId} Resolved`,
          text: `Hello ${user.name},

Your INCIDEX case ${report.caseId} has been resolved.

Case ID: ${report.caseId}
Status: Resolved

Final Details:
${report.finalDetails}

Action Taken:
${report.actionTaken}

Resolution Details:
${report.resolutionDetails}

Please log in to INCIDEX to view the complete case details.

Regards,
INCIDEX Team`,
        });

        console.log(`Resolution email sent to ${user.email}`);
      }
    } catch (emailError) {
      console.error(
        "Resolution email failed:",
        emailError.message
      );
    }

    return res.status(200).json({
      message: "Case resolved successfully",
      case: report,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

// DOWNLOAD ADMIN FINAL CASE REPORT AS PDF

router.get("/cases/pdf/:id", verifyAdmin, async (req, res) => {
  try {
    const report = await CrimeReport.findOne({
      caseId: req.params.id,
    }).populate("userId", "name email phone");

    if (!report) {
      return res.status(404).json({
        message: "Case not found",
      });
    }

    if (report.currentStatus !== "Resolved") {
      return res.status(400).json({
        message: "Final report is available only for resolved cases",
      });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${report.caseId}-final-report.pdf`
    );

    const doc = new PDFDocument();
    doc.pipe(res);

    doc.fontSize(20).text("INCIDEX", {
      align: "center",
    });

    doc.moveDown();

    doc.fontSize(16).text("Crime Incident Final Report", {
      align: "center",
    });

    doc.moveDown(2);
    doc.fontSize(12);

    doc.text(`Case ID: ${report.caseId}`);
    doc.text(`Crime Category: ${report.crimeCategory}`);
    doc.text(`Status: ${report.currentStatus}`);

    doc.text(
      `Report Date & Time: ${
        report.reportDateTime
          ? new Date(report.reportDateTime).toLocaleString()
          : "N/A"
      }`
    );

    doc.moveDown();
    doc.text("Incident Location:");
    doc.text(report.incidentLocation || "N/A");

    doc.moveDown();
    doc.text("Incident Description:");
    doc.moveDown(0.5);
    doc.text(report.incidentDescription || "N/A");

    doc.moveDown();
    doc.text("Reporting User:");
    doc.moveDown(0.5);

    doc.text(`Name: ${report.userId?.name || "N/A"}`);
    doc.text(`Email: ${report.userId?.email || "N/A"}`);
    doc.text(`Phone: ${report.userId?.phone || "N/A"}`);

    doc.moveDown();
    doc.text("Resolution Information:");
    doc.moveDown(0.5);

    doc.text(`Final Details: ${report.finalDetails || "N/A"}`);
    doc.moveDown();

    doc.text(`Action Taken: ${report.actionTaken || "N/A"}`);
    doc.moveDown();

    doc.text(
      `Resolution Details: ${report.resolutionDetails || "N/A"}`
    );

    doc.moveDown(2);
    doc.text(`Generated On: ${new Date().toLocaleString()}`);

    doc.end();
  } catch (error) {
    if (!res.headersSent) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }
});

// VIEW ALL USER FEEDBACK

router.get("/feedback", verifyAdmin, async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate("userId", "name email phone")
      .populate("caseId", "caseId crimeCategory currentStatus")
      .sort({ submittedDateTime: -1 });

    return res.status(200).json({
      feedback,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

// DELETE USER FEEDBACK

router.delete("/feedback/:id", verifyAdmin, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        message: "Feedback not found",
      });
    }

    await Feedback.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

// VIEW ALL ADMIN NOTIFICATIONS

router.get("/notifications", verifyAdmin, async (req, res) => {
  try {
    const notifications = await AdminNotification.find()
      .populate("userId", "name email phone")
      .populate(
        "caseId",
        "caseId crimeCategory currentStatus isFakeReport fineStatus appealStatus appealReason"
      )
      .sort({ createdDateTime: -1 });

    return res.status(200).json({
      notifications,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

// MARK ONE ADMIN NOTIFICATION AS READ

router.patch(
  "/notifications/read/:id",
  verifyAdmin,
  async (req, res) => {
    try {
      const notification = await AdminNotification.findByIdAndUpdate(
        req.params.id,
        { isRead: true },
        { new: true, runValidators: true }
      );

      if (!notification) {
        return res.status(404).json({
          message: "Notification not found",
        });
      }

      return res.status(200).json({
        message: "Notification marked as read",
        notification,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }
);

// MARK ALL ADMIN NOTIFICATIONS AS READ

router.patch(
  "/notifications/read-all",
  verifyAdmin,
  async (req, res) => {
    try {
      await AdminNotification.updateMany(
        { isRead: false },
        { $set: { isRead: true } }
      );

      return res.status(200).json({
        message: "All notifications marked as read",
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }
);

module.exports = router;