const express = require('express');
const CrimeReport = require('../models/crimeReport');
const jwt = require('jsonwebtoken');
const StatusHistory = require('../models/statusHistory');

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

module.exports = router;