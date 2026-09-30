const express = require('express');
const CrimeReport = require('../models/crimeReport');
const jwt = require('jsonwebtoken');
const StatusHistory = require('../models/statusHistory');
const AdminNotification = require('../models/adminNotification');
const PDFDocument = require("pdfkit");

const router = express.Router()

//VERIFY TOKEN

function verifyToken(req, res, next) {
  const token = req.headers.token;

  try {
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized request",
      });
    }

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

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

//GENERATING CASEID

async function generateCaseId() {
  const lastCase = await CrimeReport.findOne()
    .sort({ createdAt: -1 });

  if (!lastCase) {
    return "INC-0001";
  }

  const lastNumber = parseInt(
    lastCase.caseId.replace("INC-", "")
  );

  const newNumber = lastNumber + 1;

  return `INC-${String(newNumber).padStart(4, "0")}`;
}


//CREATING CRIME REPORT

router.post('/report', verifyToken, async (req, res) => {
  try {
    const {
      crimeCategory,
      incidentDescription,
      incidentLocation,
      latitude,
      longitude,
    } = req.body;

    //CRIME VALIDATIONS

    if (!crimeCategory || crimeCategory.trim() === "") {
      return res.status(400).json({
        message: "Crime category is required"
      });
    }

    if (!incidentDescription || incidentDescription.trim() === "") {
      return res.status(400).json({
        message: "incident description is required"
      });
    }

    if (!incidentLocation || incidentLocation.trim() === "") {
      return res.status(400).json({
        message: "Incident location is required",
      });
    }

    const validCategories = [
      "Theft",
      "Fraud",
      "Cybercrime",
      "Assault",
      "Vandalism",
      "Missing Person",
      "Accident",
      "Other",
    ];

    if (!validCategories.includes(crimeCategory)) {
      return res.status(400).json({
        message: 'Invalid crime category'
      });
    }

    if (incidentDescription.length < 5) {
      return res.status(400).json({
        message: "The Description must be atleast 5 characters"
      })
    }
    if (incidentDescription.length > 500) {
      return res.status(400).json({
        message:
          "Incident description cannot exceed 500 characters",
      });
    }

    const caseId = await generateCaseId();

    const newCrimeReport = new CrimeReport({
      caseId: caseId,
      userId: req.user.id,
      crimeCategory: crimeCategory,
      incidentDescription: incidentDescription,
      incidentLocation: incidentLocation,
      latitude: latitude,
      longitude: longitude,
      reportDateTime: new Date(),
      currentStatus: "New",
    });

    await newCrimeReport.save();

    await AdminNotification.create({
  userId: newCrimeReport.userId,
  caseId: newCrimeReport._id,
  message: `New crime report received. Case ID: ${newCrimeReport.caseId}.`,
  isRead: false,
  createdDateTime: new Date()
});

    await StatusHistory.create({
      caseId: newCrimeReport._id,
      status: "New",
      updatedDateTime: new Date(),
    });

    res.status(200).json({
      message: 'Crime reported successfully',
      case: newCrimeReport
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

//GET MY CASES

router.get('/my-cases', verifyToken, async (req, res) => {
  try {
    const cases = await CrimeReport.find({
      userId: req.user.id,
    }).sort({ reportDateTime: -1 });

    return res.status(200).json({
      cases: cases,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

//VIEW CASE STATUS HISTORY

router.get('/history/:id', verifyToken, async (req, res) => {
  try {

    const caseId = req.params.id;

    //FIND CASE

    const StatusReport = await CrimeReport.findOne({
      caseId: caseId,
      userId: req.user.id,
    });

    if (!StatusReport) {
      return res.status(404).json({
        message: "Case not found"
      });
    }


    //GET STATUS HISTORY

    const history = await StatusHistory.find({
      caseId: StatusReport._id,
    }).sort({
      updatedDateTime: 1,
    });

    return res.status(200).json({
      caseId: StatusReport.caseId,
      history: history,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});


//GET SINGLE CASE

router.get('/:id', verifyToken, async (req, res) => {
  try {

    const Report = await CrimeReport.findOne({
      caseId: req.params.id,
      userId: req.user.id,
    });

    if (!Report) {
      return res.status(404).json({
        message: "Case not found",
      });
    }
    res.status(200).json({
      case: Report,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


//DELETE CASE

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deletedCase = await CrimeReport.findOneAndDelete({
      caseId: req.params.id,
      userId: req.user.id,
    })

    if (!deletedCase) {
      return res.status(404).json({
        message: "Case not found",
      });
    }


    await StatusHistory.deleteMany({
      caseId: deletedCase._id
    })

    return res.status(200).json({
      message: 'Case deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
});


//VIEW CASE RESOLUTION

router.get('/resolution/:id/', verifyToken, async (req, res) => {
  try {

    const Report = await CrimeReport.findOne({
      caseId: req.params.id,
      userId: req.user.id,
    });

    if (!Report) {
      return res.status(404).json({
        message: "Case not found",
      });
    }

    if (Report.currentStatus !== "Resolved") {
      return res.status(400).json({
        message: "Case is not resolved yet",
      });
    }

    return res.status(200).json({
      caseId: Report.caseId,
      crimeCategory: Report.crimeCategory,
      currentStatus: Report.currentStatus,
      incidentLocation: Report.incidentLocation,
      reportDateTime: Report.reportDateTime,
      finalDetails: Report.finalDetails,
      actionTaken: Report.actionTaken,
      resolutionDetails: Report.resolutionDetails,
      resolvedDateTime: Report.updatedAt,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});


//DOWNLOAD FINAL REPORT AS PDF

router.get('/pdf/:id', verifyToken, async (req, res) => {
  try {

    const Report = await CrimeReport.findOne({
      caseId: req.params.id,
      userId: req.user.id,
    }).populate('userId','name email phone');

    if (!Report) {
      return res.status(404).json({
        message: "Case not found",
      });
    }

    if (Report.currentStatus !== "Resolved") {
      return res.status(400).json({
        message: "PDF is available only for resolved cases",
      });
    }

    const doc = new PDFDocument();

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${Report.caseId}-final-report.pdf`
    );

    doc.pipe(res);

    doc
      .fontSize(20)
      .text("INCIDEX", {
        align: "center",
      });

    doc.moveDown();

    doc
      .fontSize(16)
      .text("Crime Incident Final Report", {
        align: "center",
      });

    doc.moveDown(2);

    doc.fontSize(12);
    doc.text(`Name: ${Report.userId.name}`);

    doc.text(`Email: ${Report.userId.email}`);

    doc.text(`Phone Number: ${Report.userId.phone}`);

    doc.text(`Case ID: ${Report.caseId}`);

    doc.text(`Crime Category: ${Report.crimeCategory}`);

    doc.text(`Incident Description: ${Report.incidentDescription}`);

    doc.text(`Incident Location: ${Report.incidentLocation}`);

    doc.text(
      `Report Date & Time: ${Report.reportDateTime}`
    );

    doc.text(`Current Status: ${Report.currentStatus}`);



    doc.moveDown();

    doc
      .fontSize(14)
      .text("Final Details");

    doc.moveDown();

    doc
      .fontSize(12)
      .text(
        Report.finalDetails || "No final details available"
      );

    doc.moveDown();

    doc
      .fontSize(14)
      .text("Action Taken");

    doc.moveDown();

    doc
      .fontSize(12)
      .text(
        Report.actionTaken || "No action details available"
      );

    doc.moveDown();

    doc
      .fontSize(14)
      .text("Resolution Details");

    doc.moveDown();

    doc
      .fontSize(12)
      .text(
        Report.resolutionDetails ||
        "No resolution details available"
      );

    doc.moveDown(2);

    doc.text(
      `Resolved Date & Time: ${Report.updatedAt}`
    );

    doc.end();

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});



module.exports = router;