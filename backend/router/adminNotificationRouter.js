const express=require('express');
const jwt=require('jsonwebtoken');
const AdminNotification=require('../models/adminNotification');

const router=express.Router();


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
      return res.status(403).json({
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

//VIEW ALL ADMIN NOTIFICATIONS

router.get('/', verifyAdmin, async (req, res) => {

  try {

    const notifications = await AdminNotification.find()
      .populate('userId', 'name phone')
      .populate('caseId', 'caseId crimeCategory currentStatus')
      .sort({ createdDateTime: -1 });

    return res.status(200).json({
      notifications: notifications
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }

});

//MARK NOTIFICATION AS READ

router.patch('/read/:id', verifyAdmin, async (req, res) => {

  try {

    const notification = await AdminNotification.findById(
      req.params.id
    );

    if (!notification) {
      return res.status(400).json({
        message: "Notification not found"
      });
    }

    notification.isRead = true;

    await notification.save();

    return res.status(200).json({
      message: "Notification marked as read",
      notification: notification
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }

});


//MARK ALL NOTIFICATIONS AS READ

router.patch('/read-all', verifyAdmin, async (req, res) => {

  try {

    await AdminNotification.updateMany(
      { isRead: false },
      { isRead: true }
    );

    return res.status(200).json({
      message: "All notifications marked as read"
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }

});

module.exports = router;