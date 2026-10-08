const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const CrimeReport = require('../models/crimeReport');
const StatusHistory = require('../models/statusHistory');
const UserNotification = require('../models/userNotification');
const Feedback = require('../models/userFeedback');
const PDFDocument = require('pdfkit');
const transporter = require("../config/email");

const router = express.Router();

//VERIFY ADMIN TOKEN

function verifyAdmin(req, res, next) {
  const token = req.headers.token;

  try {
    if (!token) {
      return res.status(401).json({
        message: 'Unauthorized request'
      });
    }

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (payload.role !== "admin") {
      return res.status(404).json({
        message: 'Admin access required'
      });
    }

    req.admin = payload;
    next();

  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired token'
    });
  }
}


//VIEW ALL USERS

router.get('/users', verifyAdmin, async (req, res) => {

  try {

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      users: users
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }

});


//VIEW SINGLE USER

router.get('/users/:id', verifyAdmin, async (req, res) => {

  try {

    const user = await User.findById(req.params.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json({
      user: user
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }

});


//VIEW ALL CRIME CASES

router.get('/cases', verifyAdmin, async (req, res) => {

  try {

    const cases = await CrimeReport.find()
      .populate('userId', 'name phone')
      .sort({ reportDateTime: -1 });

    return res.status(200).json({
      cases: cases
    });

  } catch (error) {

    return res.status(400).json({
      message: error.message
    });

  }

});


//VIEW SINGLE CASE

router.get('/cases/:id', verifyAdmin, async (req, res) => {

  try {

    const Report = await CrimeReport.findOne({
      caseId: req.params.id
    }).populate(
      'userId',
      'name email phone'
    );

    if (!Report) {
      return res.status(400).json({
        message: 'Case not found'
      });
    }

    return res.status(200).json({
      case: Report
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }

});


//UPDATE CASE STATUS

router.patch('/cases/status/:id', verifyAdmin, async (req, res) => {

  try {

    const { status } = req.body;

    if (!status || status.trim() === "") {
      return res.status(400).json({
        message: 'Status is required'
      });
    }

    const validStatuses = [
      'Acknowledged',
      'In Progress'
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status'
      });
    }

    const Report = await CrimeReport.findOne({
      caseId: req.params.id
    });

    if (!Report) {
      return res.status(404).json({
        message: 'Case not found'
      });
    }

    const currentStatus = Report.currentStatus;

    if (currentStatus === 'Resolved') {
      return res.status(400).json({
        message: 'Resolved cases cannot be updated'
      });
    }

    if (
      currentStatus === 'New' &&
      status !== 'Acknowledged'
    ) {
      return res.status(400).json({
        message: 'New case can only be changed to Acknowledged'
      });
    }

    if (
      currentStatus === 'Acknowledged' &&
      status !== 'In Progress'
    ) {
      return res.status(400).json({
        message: 'Acknowledged case can only be changed to In Progress'
      });
    }

    Report.currentStatus = status;

    await Report.save();

    await StatusHistory.create({
      caseId: Report._id,
      status: status,
      updatedDateTime: new Date()
    });

    //CREATE IN-SITE USER NOTIFICATION

    await UserNotification.create({
      userId: Report.userId,
      caseId: Report._id,
      message: `Your case ${Report.caseId} status has been updated to ${status}.`,
      isRead: false,
      createdDateTime: new Date()
    });

    //SEND EMAIL NOTIFICATION

    try {

      const user = await User.findById(Report.userId);

      if (user && user.email) {

        await transporter.sendMail({
          from: `"INCIDEX" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: `INCIDEX Case ${Report.caseId} Status Update`,
          text: `Hello ${user.name},

Your INCIDEX case ${Report.caseId} status has been updated.

Current Status: ${status}

Please log in to INCIDEX to view your case details.

Regards,
INCIDEX Team`
        });

        console.log(
          `Email notification sent to ${user.email}`
        );

      }

    } catch (emailError) {

      console.error(
        "Email notification failed:",
        emailError.message
      );

    }

    return res.status(200).json({
      message: 'Case status updated successfully',
      case: Report
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }

});


//RESOLVE CASE

router.patch('/cases/resolve/:id', verifyAdmin, async (req, res) => {

  try {

    const {
      finalDetails,
      actionTaken,
      resolutionDetails
    } = req.body;

    if (!finalDetails || finalDetails.trim() === "") {
      return res.status(400).json({
        message: "Final details are required"
      });
    }

    if (!actionTaken || actionTaken.trim() === "") {
      return res.status(400).json({
        message: "Action taken is required"
      });
    }

    if (!resolutionDetails || resolutionDetails.trim() === "") {
      return res.status(400).json({
        message: "Resolution details are required"
      });
    }

    const Report = await CrimeReport.findOne({
      caseId: req.params.id
    });

    if (!Report) {
      return res.status(404).json({
        message: "Case not found"
      });
    }

    if (Report.currentStatus !== 'In Progress') {
      return res.status(400).json({
        message: 'Only In Progress cases can be resolved'
      });
    }

    Report.currentStatus = 'Resolved';
    Report.finalDetails = finalDetails.trim();
    Report.actionTaken = actionTaken.trim();
    Report.resolutionDetails = resolutionDetails.trim();

    await Report.save();

    await StatusHistory.create({
      caseId: Report._id,
      status: "Resolved",
      updatedDateTime: new Date()
    });

    //CREATE IN-SITE USER NOTIFICATION

    await UserNotification.create({
      userId: Report.userId,
      caseId: Report._id,
      message: `Your case ${Report.caseId} has been resolved.`,
      isRead: false,
      createdDateTime: new Date()
    });

    //SEND RESOLUTION EMAIL

    try {

      const user = await User.findById(Report.userId);

      if (user && user.email) {

        await transporter.sendMail({
          from: `"INCIDEX" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: `INCIDEX Case ${Report.caseId} Resolved`,
          text: `Hello ${user.name},

Your INCIDEX case ${Report.caseId} has been resolved.

Case ID: ${Report.caseId}
Status: Resolved

Final Details:
${Report.finalDetails}

Action Taken:
${Report.actionTaken}

Resolution Details:
${Report.resolutionDetails}

Please log in to INCIDEX to view the complete case details.

Regards,
INCIDEX Team`
        });

        console.log(
          `Resolution email sent to ${user.email}`
        );

      }

    } catch (emailError) {

      console.error(
        "Resolution email failed:",
        emailError.message
      );

    }

    return res.status(200).json({
      message: 'Case resolved successfully',
      case: Report
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }

});


//DOWNLOAD FINAL CASE REPORT

router.get('/cases/pdf/:id', verifyAdmin, async (req, res) => {

  try {

    const Report = await CrimeReport.findOne({
      caseId: req.params.id
    }).populate(
      'userId',
      'name email phone'
    );

    if (!Report) {
      return res.status(404).json({
        message: 'Case not found'
      });
    }

    if (Report.currentStatus !== 'Resolved') {
      return res.status(400).json({
        message: 'Final report is available only for resolved cases'
      });
    }

    const doc = new PDFDocument();

    res.setHeader(
      'Content-Type',
      'application/pdf'
    );

    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${Report.caseId}-final-report.pdf`
    );

    doc.pipe(res);

    // TITLE

    doc
      .fontSize(20)
      .text('INCIDEX', {
        align: 'center'
      });

    doc.moveDown();

    doc
      .fontSize(16)
      .text('Crime Incident Final Report', {
        align: 'center'
      });

    doc.moveDown(2);

    // CASE INFORMATION

    doc.fontSize(12);

    doc.text(`Case ID: ${Report.caseId}`);

    doc.text(
      `Crime Category: ${Report.crimeCategory}`
    );

    doc.text(
      `Status: ${Report.currentStatus}`
    );

    doc.text(
      `Report Date & Time: ${Report.reportDateTime
        ? new Date(
          Report.reportDateTime
        ).toLocaleString()
        : 'N/A'
      }`
    );

    doc.moveDown();

    // INCIDENT LOCATION

    doc.text('Incident Location:');

    doc.text(
      Report.incidentLocation || 'N/A'
    );

    doc.moveDown();

    // INCIDENT DESCRIPTION

    doc.text('Incident Description:');

    doc.moveDown(0.5);

    doc.text(
      Report.incidentDescription || 'N/A'
    );

    doc.moveDown();

    // USER INFORMATION

    doc.text('Reporting User:');

    doc.moveDown(0.5);

    doc.text(
      `Name: ${Report.userId?.name || 'N/A'
      }`
    );

    doc.text(
      `Email: ${Report.userId?.email || 'N/A'
      }`
    );

    doc.text(
      `Phone: ${Report.userId?.phone || 'N/A'
      }`
    );

    doc.moveDown();

    // RESOLUTION INFORMATION

    doc.text('Resolution Information:');

    doc.moveDown(0.5);

    doc.text(
      `Final Details: ${Report.finalDetails || 'N/A'
      }`
    );

    doc.moveDown();

    doc.text(
      `Action Taken: ${Report.actionTaken || 'N/A'
      }`
    );

    doc.moveDown();

    doc.text(
      `Resolution Details: ${Report.resolutionDetails || 'N/A'
      }`
    );

    doc.moveDown(2);

    doc.text(
      `Generated On: ${new Date().toLocaleString()}`
    );

    doc.end();

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }

});


//VIEW ALL USER FEEDBACK

router.get('/feedback', verifyAdmin, async (req, res) => {

  try {

    const feedback = await Feedback.find()
      .populate('userId', 'name email phone')
      .populate('caseId', 'caseId crimeCategory currentStatus')
      .sort({ submittedDateTime: -1 });

    return res.status(200).json({
      feedback: feedback
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }

});


//DELETE USER FEEDBACK

router.delete('/feedback/:id', verifyAdmin, async (req, res) => {

  try {

    const feedback = await Feedback.findById(
      req.params.id
    );

    if (!feedback) {
      return res.status(404).json({
        message: "Feedback not found"
      });
    }

    await Feedback.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      message: "Feedback deleted successfully"
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }

});


module.exports = router;