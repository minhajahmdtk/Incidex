const express = require("express");
const CrimeReport = require("../models/crimeReport");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const StatusHistory = require("../models/statusHistory");
const AdminNotification = require("../models/adminNotification");
const UserNotification = require("../models/userNotification");
const PDFDocument = require("pdfkit");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const emailService = require("../config/email");

const router = express.Router();

// =====================================================
// EMAIL NOTIFICATION HELPER
// =====================================================

async function sendCaseEmailSafely(userId, subject, text) {
  try {
    const user = await User.findById(userId).select("name email");

    if (!user || !user.email) {
      console.error("Email not sent: user email was not found");
      return;
    }

    if (typeof emailService === "function") {
      // Supports a config exporting sendEmail({ to, subject, text })
      await emailService({
        to: user.email,
        subject,
        text,
      });
    } else if (emailService && typeof emailService.sendMail === "function") {
      // Supports a config exporting a Nodemailer transporter
      await emailService.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject,
        text,
      });
    } else {
      throw new Error(
        "Email configuration must export a sendEmail function or Nodemailer transporter"
      );
    }

    console.log(`INCIDEX email sent successfully to ${user.email}`);
  } catch (error) {
    // Do not undo a successful case/payment update if email delivery fails.
    console.error("INCIDEX email sending failed:", error.message);
  }
}

// =====================================================
// RAZORPAY CONFIGURATION
// =====================================================

function getRazorpay() {
  if (
    !process.env.RAZORPAY_KEY_ID ||
    !process.env.RAZORPAY_KEY_SECRET
  ) {
    throw new Error("Razorpay environment variables are missing");
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// =====================================================
// VERIFY USER TOKEN
// =====================================================

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

// =====================================================
// VERIFY ADMIN TOKEN
// =====================================================

function verifyAdminToken(req, res, next) {
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

// =====================================================
// GENERATE CASE ID
// =====================================================

async function generateCaseId() {
  const lastCase = await CrimeReport.findOne().sort({
    createdAt: -1,
  });

  if (!lastCase) {
    return "INC-0001";
  }

  const lastNumber = parseInt(
    lastCase.caseId.replace("INC-", ""),
    10
  );

  if (!Number.isFinite(lastNumber)) {
    throw new Error("Unable to generate the next case ID");
  }

  return `INC-${String(lastNumber + 1).padStart(4, "0")}`;
}

// =====================================================
// CREATE CRIME REPORT
// =====================================================

router.post("/report", verifyToken, async (req, res) => {
  try {
    const {
      crimeCategory,
      incidentDescription,
      incidentLocation,
      latitude,
      longitude,
    } = req.body;

    if (
      typeof crimeCategory !== "string" ||
      !crimeCategory.trim()
    ) {
      return res.status(400).json({
        message: "Crime category is required",
      });
    }

    if (
      typeof incidentDescription !== "string" ||
      !incidentDescription.trim()
    ) {
      return res.status(400).json({
        message: "Incident description is required",
      });
    }

    if (
      typeof incidentLocation !== "string" ||
      !incidentLocation.trim()
    ) {
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

    if (!validCategories.includes(crimeCategory.trim())) {
      return res.status(400).json({
        message: "Invalid crime category",
      });
    }

    const description = incidentDescription.trim();

    if (description.length < 5 || description.length > 500) {
      return res.status(400).json({
        message: "Description must contain 5 to 500 characters",
      });
    }

    if (
      latitude != null &&
      (typeof latitude !== "number" ||
        !Number.isFinite(latitude) ||
        latitude < -90 ||
        latitude > 90)
    ) {
      return res.status(400).json({
        message: "Invalid latitude",
      });
    }

    if (
      longitude != null &&
      (typeof longitude !== "number" ||
        !Number.isFinite(longitude) ||
        longitude < -180 ||
        longitude > 180)
    ) {
      return res.status(400).json({
        message: "Invalid longitude",
      });
    }

    const caseId = await generateCaseId();

    const newCrimeReport = new CrimeReport({
      caseId,
      userId: req.user.id,
      crimeCategory: crimeCategory.trim(),
      description,
      location: incidentLocation.trim(),
      latitude: latitude ?? null,
      longitude: longitude ?? null,
      currentStatus: "New",
    });

    await newCrimeReport.save();

    await AdminNotification.create({
      userId: newCrimeReport.userId,
      caseId: newCrimeReport._id,
      type: "crime_report",
      message: `New crime report received. Case ID: ${caseId}.`,
      isRead: false,
      createdDateTime: new Date(),
    });

    await StatusHistory.create({
      caseId: newCrimeReport._id,
      status: "New",
      updatedDateTime: new Date(),
    });

    return res.status(201).json({
      message: "Crime reported successfully",
      case: newCrimeReport,
    });
  } catch (error) {
    console.error("Create report failed:", error);

    return res.status(500).json({
      message: "Unable to create crime report",
      error: error.message,
    });
  }
});

// =====================================================
// ADMIN MARKS A REPORT AS FAKE AND RECORDS A FINE
// =====================================================

router.patch(
  "/admin/fake-report/:id",
  verifyAdminToken,
  async (req, res) => {
    try {
      const { reason, fineAmount } = req.body;

      if (
        typeof reason !== "string" ||
        reason.trim().length < 5
      ) {
        return res.status(400).json({
          message: "Please provide a reason of at least 5 characters",
        });
      }

      if (
        typeof fineAmount !== "number" ||
        !Number.isFinite(fineAmount) ||
        fineAmount <= 0 ||
        !Number.isSafeInteger(Math.round(fineAmount * 100))
      ) {
        return res.status(400).json({
          message: "Fine amount must be valid and greater than zero",
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

      if (report.isFakeReport) {
        return res.status(400).json({
          message: "This report has already been marked as fake",
        });
      }

      const updatedReport = await CrimeReport.findOneAndUpdate(
        { _id: report._id },
        {
          $set: {
            isFakeReport: true,
            fakeReportReason: reason.trim(),
            fineAmount,
            fineStatus: "Pending",
            appealReason: "",
            appealStatus: "Not Appealed",
          },
        },
        { returnDocument: "after", runValidators: false }
      );

      await UserNotification.create({
        userId: report.userId,
        caseId: report._id,
        message:
          `Case ${report.caseId} has been flagged as a suspected fake report. ` +
          `Reason: ${reason.trim()}. Fine: ₹${fineAmount}. You may appeal.`,
        isRead: false,
        createdDateTime: new Date(),
      });

      // EMAIL: FAKE REPORT NOTICE
      await sendCaseEmailSafely(
        report.userId,
        `INCIDEX: Fake Report Notice - ${report.caseId}`,
        `Hello,

Your crime report ${report.caseId} has been flagged as a suspected fake report by the INCIDEX administrator.

Reason: ${reason.trim()}
Fine amount: ₹${fineAmount}

If you disagree with this decision, you may submit an appeal through your INCIDEX account.

Please log in to INCIDEX to review your case.

Regards,
INCIDEX Team`
      );

      return res.status(200).json({
        message: "Report flagged and user notified",
        case: updatedReport,
      });
    } catch (error) {
      console.error("Mark fake report failed:", error);

      return res.status(500).json({
        message: error.message,
      });
    }
  }
);

// =====================================================
// USER SUBMITS AN APPEAL
// =====================================================

router.post("/appeal/:id", verifyToken, async (req, res) => {
  try {
    const { appealReason } = req.body;

    if (
      typeof appealReason !== "string" ||
      appealReason.trim().length < 5
    ) {
      return res.status(400).json({
        message: "Appeal reason must be at least 5 characters",
      });
    }

    const report = await CrimeReport.findOne({
      caseId: req.params.id,
      userId: req.user.id,
    });

    if (!report) {
      return res.status(404).json({
        message: "Case not found",
      });
    }

    if (
      !report.isFakeReport ||
      !report.fineAmount ||
      report.fineAmount <= 0
    ) {
      return res.status(400).json({
        message: "There is no fine available to appeal",
      });
    }

    if (
      report.fineStatus !== "Pending" ||
      report.appealStatus !== "Not Appealed"
    ) {
      return res.status(400).json({
        message: "This fine cannot be appealed again",
      });
    }

    const updatedReport = await CrimeReport.findOneAndUpdate(
      {
        _id: report._id,
        userId: req.user.id,
        fineStatus: "Pending",
        appealStatus: "Not Appealed",
      },
      {
        $set: {
          appealReason: appealReason.trim(),
          appealStatus: "Pending",
          fineStatus: "Appealed",
        },
      },
      { returnDocument: "after", runValidators: false }
    );

    if (!updatedReport) {
      return res.status(409).json({
        message: "The appeal status changed. Please refresh and try again.",
      });
    }

    await AdminNotification.create({
      userId: report.userId,
      caseId: report._id,
      type: "appeal",
      message: `An appeal has been submitted for case ${report.caseId}. Please review it.`,
      isRead: false,
      createdDateTime: new Date(),
    });

    return res.status(200).json({
      message: "Appeal submitted successfully",
      case: updatedReport,
    });
  } catch (error) {
    console.error("Submit appeal failed:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
});

// =====================================================
// ADMIN REVIEWS THE USER'S APPEAL
// =====================================================

router.patch(
  "/admin/review-appeal/:id",
  verifyAdminToken,
  async (req, res) => {
    try {
      const { decision } = req.body;

      if (!["Approved", "Rejected"].includes(decision)) {
        return res.status(400).json({
          message: 'Decision must be "Approved" or "Rejected"',
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

      if (
        report.appealStatus !== "Pending" ||
        report.fineStatus !== "Appealed"
      ) {
        return res.status(400).json({
          message: "There is no pending appeal to review",
        });
      }

      const fineStatus =
        decision === "Approved" ? "Cancelled" : "Upheld";

      const updatedReport = await CrimeReport.findOneAndUpdate(
        {
          _id: report._id,
          appealStatus: "Pending",
          fineStatus: "Appealed",
        },
        {
          $set: {
            appealStatus: decision,
            appealReviewedAt: new Date(),
            fineStatus,
          },
        },
        { returnDocument: "after", runValidators: false }
      );

      if (!updatedReport) {
        return res.status(409).json({
          message: "The appeal was already reviewed. Refresh the page.",
        });
      }

      const resultMessage =
        decision === "Approved"
          ? `Your appeal for case ${report.caseId} was approved. The fine has been cancelled.`
          : `Your appeal for case ${report.caseId} was rejected. The fine has been upheld. You can now pay online.`;

      await UserNotification.create({
        userId: report.userId,
        caseId: report._id,
        message: resultMessage,
        isRead: false,
        createdDateTime: new Date(),
      });

      // EMAIL: APPEAL DECISION
      const appealEmailText =
        decision === "Approved"
          ? `Hello,

Your appeal for case ${report.caseId} has been APPROVED.

The fine amount of ₹${report.fineAmount} has been cancelled. You do not need to pay this fine.

Regards,
INCIDEX Team`
          : `Hello,

Your appeal for case ${report.caseId} has been REJECTED.

Fine amount: ₹${report.fineAmount}
Fine status: Upheld

The fine remains payable. Please log in to INCIDEX to review your case and proceed with the available online payment option.

Regards,
INCIDEX Team`;

      await sendCaseEmailSafely(
        report.userId,
        `INCIDEX: Appeal ${decision} - ${report.caseId}`,
        appealEmailText
      );

      return res.status(200).json({
        message:
          decision === "Approved"
            ? "Appeal approved and fine cancelled"
            : "Appeal rejected and fine upheld",
        case: updatedReport,
      });
    } catch (error) {
      console.error("Review appeal failed:", error);

      return res.status(500).json({
        message: error.message,
      });
    }
  }
);

// =====================================================
// CREATE RAZORPAY ORDER FOR AN UPHELD FINE
// POST /cases/pay-fine/:id
// =====================================================

router.post("/pay-fine/:id", verifyToken, async (req, res) => {
  try {
    const report = await CrimeReport.findOne({
      caseId: req.params.id,
      userId: req.user.id,
    });

    if (!report) {
      return res.status(404).json({
        message: "Case not found",
      });
    }

    if (
      !report.isFakeReport ||
      report.appealStatus !== "Rejected" ||
      report.fineStatus !== "Upheld"
    ) {
      return res.status(400).json({
        message: "Payment is available only for upheld fines",
      });
    }

    if (report.finePaidAt || report.fineStatus === "Paid") {
      return res.status(400).json({
        message: "This fine has already been paid",
      });
    }

    if (
      !Number.isFinite(report.fineAmount) ||
      report.fineAmount <= 0
    ) {
      return res.status(400).json({
        message: "Invalid fine amount",
      });
    }

    const amountInPaise = Math.round(report.fineAmount * 100);

    if (!Number.isSafeInteger(amountInPaise) || amountInPaise <= 0) {
      return res.status(400).json({
        message: "Fine amount is invalid for payment",
      });
    }

    const razorpay = getRazorpay();

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `fine_${report.caseId}`,
      notes: {
        caseId: report.caseId,
        userId: String(report.userId),
        purpose: "INCIDEX fine payment",
      },
    });

    const updateResult = await CrimeReport.updateOne(
      {
        _id: report._id,
        userId: req.user.id,
        fineStatus: "Upheld",
        appealStatus: "Rejected",
        finePaidAt: null,
      },
      {
        $set: {
          razorpayOrderId: order.id,
          razorpayPaymentId: null,
        },
      },
      { runValidators: false }
    );

    if (updateResult.matchedCount === 0) {
      return res.status(409).json({
        message: "The fine status changed. Refresh and try again.",
      });
    }

    return res.status(201).json({
      message: "Payment order created successfully",
      keyId: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      caseId: report.caseId,
    });
  } catch (error) {
    console.error("Razorpay order creation failed:", error);

    return res.status(500).json({
      message: "Unable to create payment order",
      error: error.message,
      statusCode: error.statusCode || error.status || null,
    });
  }
});

// =====================================================
// VERIFY RAZORPAY PAYMENT
// POST /cases/verify-fine-payment/:id
// =====================================================

router.post(
  "/verify-fine-payment/:id",
  verifyToken,
  async (req, res) => {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      } = req.body;

      if (
        typeof razorpay_order_id !== "string" ||
        typeof razorpay_payment_id !== "string" ||
        typeof razorpay_signature !== "string"
      ) {
        return res.status(400).json({
          message: "Razorpay payment details are required",
        });
      }

      const report = await CrimeReport.findOne({
        caseId: req.params.id,
        userId: req.user.id,
      });

      if (!report) {
        return res.status(404).json({
          message: "Case not found",
        });
      }

      if (
        !report.razorpayOrderId ||
        report.razorpayOrderId !== razorpay_order_id
      ) {
        return res.status(400).json({
          message: "Payment order does not match this case",
        });
      }

      if (
        report.fineStatus === "Paid" &&
        report.razorpayPaymentId === razorpay_payment_id
      ) {
        return res.status(200).json({
          message: "Fine payment has already been verified",
          fineStatus: "Paid",
          caseId: report.caseId,
        });
      }

      if (
        report.appealStatus !== "Rejected" ||
        report.fineStatus !== "Upheld"
      ) {
        return res.status(400).json({
          message: "This fine is not eligible for payment",
        });
      }

      const razorpay = getRazorpay();

      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      const expectedBuffer = Buffer.from(expectedSignature, "hex");
      const receivedBuffer = Buffer.from(razorpay_signature, "hex");

      if (
        expectedBuffer.length !== receivedBuffer.length ||
        !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
      ) {
        return res.status(400).json({
          message: "Invalid payment signature",
        });
      }

      const order = await razorpay.orders.fetch(razorpay_order_id);
      const expectedAmount = Math.round(report.fineAmount * 100);

      if (
        order.amount !== expectedAmount ||
        order.currency !== "INR"
      ) {
        return res.status(400).json({
          message: "Payment order amount does not match the fine",
        });
      }

      const payment = await razorpay.payments.fetch(
        razorpay_payment_id
      );

      if (
        payment.order_id !== razorpay_order_id ||
        payment.amount !== expectedAmount ||
        payment.currency !== "INR"
      ) {
        return res.status(400).json({
          message: "Payment details do not match the order",
        });
      }

      if (payment.status !== "captured") {
        return res.status(409).json({
          message:
            "Payment has not been captured yet. Check payment status again.",
          paymentStatus: payment.status,
        });
      }

      // Update only payment fields to avoid legacy validation errors.
      const finePaidAt = new Date();

      const updateResult = await CrimeReport.updateOne(
        {
          _id: report._id,
          userId: req.user.id,
          razorpayOrderId: razorpay_order_id,
          appealStatus: "Rejected",
          fineStatus: "Upheld",
        },
        {
          $set: {
            fineStatus: "Paid",
            razorpayPaymentId: razorpay_payment_id,
            finePaidAt,
          },
        },
        { runValidators: false }
      );

      if (updateResult.matchedCount === 0) {
        const latestReport = await CrimeReport.findOne({
          _id: report._id,
          userId: req.user.id,
        });

        if (
          latestReport &&
          latestReport.fineStatus === "Paid" &&
          latestReport.razorpayPaymentId === razorpay_payment_id
        ) {
          return res.status(200).json({
            message: "Fine payment has already been verified",
            fineStatus: "Paid",
            caseId: report.caseId,
          });
        }

        return res.status(409).json({
          message: "The fine status changed. Please refresh and check.",
        });
      }

      await UserNotification.create({
        userId: report.userId,
        caseId: report._id,
        message:
          `Payment for the fine on case ${report.caseId} was verified successfully.`,
        isRead: false,
        createdDateTime: finePaidAt,
      });

      // EMAIL: SUCCESSFUL FINE PAYMENT
      await sendCaseEmailSafely(
        report.userId,
        `INCIDEX: Fine Payment Successful - ${report.caseId}`,
        `Hello,

Your fine payment has been verified successfully.

Case ID: ${report.caseId}
Amount paid: ₹${report.fineAmount}
Payment ID: ${razorpay_payment_id}
Payment date: ${finePaidAt.toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        })}
Fine status: Paid

Please keep this email for your records.

Thank you,
INCIDEX Team`
      );

      return res.status(200).json({
        message: "Fine payment verified successfully",
        fineStatus: "Paid",
        fineAmount: report.fineAmount,
        finePaidAt,
        caseId: report.caseId,
        paymentId: razorpay_payment_id,
      });
    } catch (error) {
      console.error("Razorpay payment verification failed:", error);

      return res.status(500).json({
        message: "Unable to verify fine payment",
        error: error.message,
      });
    }
  }
);

// =====================================================
// GET MY CASES
// =====================================================

router.get("/my-cases", verifyToken, async (req, res) => {
  try {
    const cases = await CrimeReport.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({ cases });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// =====================================================
// VIEW CASE STATUS HISTORY
// =====================================================

router.get("/history/:id", verifyToken, async (req, res) => {
  try {
    const report = await CrimeReport.findOne({
      caseId: req.params.id,
      userId: req.user.id,
    });

    if (!report) {
      return res.status(404).json({ message: "Case not found" });
    }

    const history = await StatusHistory.find({
      caseId: report._id,
    }).sort({ updatedDateTime: 1 });

    return res.status(200).json({
      caseId: report.caseId,
      history,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// =====================================================
// VIEW CASE RESOLUTION
// =====================================================

router.get("/resolution/:id", verifyToken, async (req, res) => {
  try {
    const report = await CrimeReport.findOne({
      caseId: req.params.id,
      userId: req.user.id,
    });

    if (!report) {
      return res.status(404).json({ message: "Case not found" });
    }

    if (report.currentStatus !== "Resolved") {
      return res.status(400).json({
        message: "Case is not resolved yet",
      });
    }

    return res.status(200).json({
      caseId: report.caseId,
      crimeCategory: report.crimeCategory,
      description: report.description,
      location: report.location,
      currentStatus: report.currentStatus,
      createdAt: report.createdAt,
      finalDetails: report.finalDetails,
      actionTaken: report.actionTaken,
      resolutionDetails: report.resolutionDetails,
      resolvedDateTime: report.updatedAt,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// =====================================================
// DOWNLOAD USER'S FINAL REPORT AS PDF
// =====================================================

router.get("/pdf/:id", verifyToken, async (req, res) => {
  try {
    const report = await CrimeReport.findOne({
      caseId: req.params.id,
      userId: req.user.id,
    }).populate("userId", "name email phone");

    if (!report) {
      return res.status(404).json({ message: "Case not found" });
    }

    if (report.currentStatus !== "Resolved") {
      return res.status(400).json({
        message: "PDF is available only for resolved cases",
      });
    }

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${report.caseId}-final-report.pdf`
    );

    doc.pipe(res);

    doc.fontSize(20).text("INCIDEX", { align: "center" });
    doc.moveDown();

    doc.fontSize(16).text("Crime Incident Final Report", {
      align: "center",
    });

    doc.moveDown(2);
    doc.fontSize(12);

    doc.text(`Name: ${report.userId?.name || "N/A"}`);
    doc.text(`Email: ${report.userId?.email || "N/A"}`);
    doc.text(`Phone Number: ${report.userId?.phone || "N/A"}`);
    doc.text(`Case ID: ${report.caseId}`);
    doc.text(`Crime Category: ${report.crimeCategory}`);
    doc.text(`Incident Description: ${report.description || "N/A"}`);
    doc.text(`Incident Location: ${report.location || "N/A"}`);
    doc.text(
      `Report Date & Time: ${
        report.createdAt
          ? new Date(report.createdAt).toLocaleString()
          : "N/A"
      }`
    );
    doc.text(`Current Status: ${report.currentStatus}`);

    doc.moveDown();
    doc.fontSize(14).text("Final Details");
    doc.moveDown();
    doc.fontSize(12).text(
      report.finalDetails || "No final details available"
    );

    doc.moveDown();
    doc.fontSize(14).text("Action Taken");
    doc.moveDown();
    doc.fontSize(12).text(
      report.actionTaken || "No action details available"
    );

    doc.moveDown();
    doc.fontSize(14).text("Resolution Details");
    doc.moveDown();
    doc.fontSize(12).text(
      report.resolutionDetails || "No resolution details available"
    );

    doc.moveDown(2);
    doc.text(
      `Resolved Date & Time: ${
        report.updatedAt
          ? new Date(report.updatedAt).toLocaleString()
          : "N/A"
      }`
    );

    doc.end();
  } catch (error) {
    console.error("Generate PDF failed:", error);

    if (!res.headersSent) {
      return res.status(500).json({ message: error.message });
    }
  }
});

// =====================================================
// GET SINGLE CASE
// =====================================================

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const report = await CrimeReport.findOne({
      caseId: req.params.id,
      userId: req.user.id,
    });

    if (!report) {
      return res.status(404).json({ message: "Case not found" });
    }

    return res.status(200).json({ case: report });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// =====================================================
// DELETE CASE
// =====================================================

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deletedCase = await CrimeReport.findOneAndDelete({
      caseId: req.params.id,
      userId: req.user.id,
    });

    if (!deletedCase) {
      return res.status(404).json({ message: "Case not found" });
    }

    await StatusHistory.deleteMany({
      caseId: deletedCase._id,
    });

    return res.status(200).json({
      message: "Case deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;

