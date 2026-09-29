const express=require('express');
const jwt=require('jsonwebtoken');
const UserNotification=require('../models/userNotification');
const router=express.Router();


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


//GET USER NOTIFICATIONS

router.get("/", verifyToken, async (req, res) => {
  try {
    const notifications = await UserNotification.find({
      userId: req.user.id,
    }).sort({
      createdDateTime: -1,
    });

    return res.status(200).json({
      notifications: notifications,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

//MARK ONE NOTIFICATION AS READ

router.put("/read/:id", verifyToken, async (req, res) => {
  try {
    const notification = await UserNotification.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    notification.isRead = true;

    await notification.save();

    return res.status(200).json({
      message: "Notification marked as read",
      notification: notification,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

//MARK ALL NOTIFICATIONS AS READ

router.put("/read-all", verifyToken, async (req, res) => {
  try {
    await UserNotification.updateMany(
      {
        userId: req.user.id,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

    return res.status(200).json({
      message: "All notifications marked as read",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

//DELETE NOTIFICATION

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const notification = await UserNotification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      message: "Notification deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;