const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const CrimeReport = require('../models/crimeReport');


const router = express.Router()

//VERIFY ADMIN TOKEN

function verifyAdmin(req, res, next) {

  const token = req.headers.token;

  try {

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized request"
      });
    }

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (payload.role !== "admin") {
      return res.status(400).json({
        message: "Admin access required"
      });
    }

    req.admin = payload;

    next();

  } catch (error) {

    return res.status(401).json({
      message: "Invalid or expired token"
    });

  }
}
//ADMIN DASHBOARD

router.get('/', verifyAdmin, async (req, res) => {

  try {

    const totalUsers = await User.countDocuments();

    const totalCases = await CrimeReport.countDocuments();

    const newCases = await CrimeReport.countDocuments({
      currentStatus: "New"
    });

    const acknowledgedCases = await CrimeReport.countDocuments({
      currentStatus: "Acknowledged"
    });

    const inProgressCases = await CrimeReport.countDocuments({
      currentStatus: "In Progress"
    });

    const resolvedCases = await CrimeReport.countDocuments({
      currentStatus: "Resolved"
    });

    return res.status(200).json({

      totalUsers: totalUsers,

      totalCases: totalCases,

      casesByStatus: {
        new: newCases,
        acknowledged: acknowledgedCases,
        inProgress: inProgressCases,
        resolved: resolvedCases
      }

    });

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }

});

//CASES BY CATEGORY

router.get('/category', verifyAdmin, async (req, res) => {

  try {

    const categoryData = await CrimeReport.aggregate([
      {
        $group: {
          _id: "$crimeCategory",
          count: {
            $sum: 1
          }
        }
      },

      {
        $sort: {
          count: -1
        }
      }
    ]);

    return res.status(200).json({
      categoryData: categoryData
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }

});

//MONTHLY CASE STATISTICS

router.get('/monthly', verifyAdmin, async (req, res) => {

  try {

    const monthlyData = await CrimeReport.aggregate([
      {
        $group: {
          _id: {
            year: {
              $year: "$reportDateTime"
            },

            month: {
              $month: "$reportDateTime"
            }
          },

          count: {
            $sum: 1
          }
        }
      },

      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      }
    ]);

    return res.status(200).json({
      monthlyData: monthlyData
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }

});

module.exports = router;