const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/user');

const router = express.Router();


// EMAIL TRANSPORTER

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// REGISTER USER

router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    if (!email || email.trim() === "") {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    if (!phone || phone.trim() === "") {
      return res.status(400).json({
        message: "Phone number is required",
      });
    }

    if (!password || password.trim() === "") {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    if (!confirmPassword || confirmPassword.trim() === "") {
      return res.status(400).json({
        message: "Confirm password is required",
      });
    }

    const nameRegex = /^[A-Za-z ]{2,20}$/;

    if (!nameRegex.test(name.trim())) {
      return res.status(400).json({
        message:
          "Name must contain only letters and spaces and be 2 to 20 characters long",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    const phoneRegex = /^[6-9][0-9]{9}$/;

    if (!phoneRegex.test(phone.trim())) {
      return res.status(400).json({
        message: "Please enter a valid phone number",
      });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,20}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be 8 to 20 characters and contain uppercase, lowercase, number and special character",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    const emailExist = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (emailExist) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const phoneExist = await User.findOne({
      phone: phone.trim(),
    });

    if (phoneExist) {
      return res.status(400).json({
        message: "Phone number already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// LOGIN

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || email.trim() === "") {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    if (!password || password.trim() === "") {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: "user",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const userResponse = user.toObject();

    delete userResponse.password;
    delete userResponse.resetPasswordToken;
    delete userResponse.resetPasswordExpires;

    res.status(200).json({
      message: "Login successful",
      token: token,
      user: userResponse,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// FORGOT PASSWORD

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || email.trim() === "") {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(404).json({
        message: "No account found with this email",
      });
    }

    // Generate reset token

    const resetToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    // Save reset token and expiry

    user.resetPasswordToken = resetToken;

    user.resetPasswordExpires = new Date(
      Date.now() + 15 * 60 * 1000
    );

    await user.save();

    // Reset password URL

    const resetLink =
      `http://localhost:5173/reset-password/${resetToken}`;

    // Send email

    await transporter.sendMail({
      from: `"INCIDEX" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "INCIDEX - Password Reset",

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 30px auto;
          padding: 30px;
          border: 1px solid #ddd;
          border-radius: 10px;
          background-color: #ffffff;
        ">

          <h2 style="
            color: #333333;
            margin-bottom: 20px;
          ">
            INCIDEX Password Reset
          </h2>

          <p>
            Hello ${user.name},
          </p>

          <p>
            We received a request to reset your INCIDEX password.
          </p>

          <p>
            Click the button below to create a new password.
          </p>

          <div style="
            text-align: center;
            margin: 30px 0;
          ">

            <a
              href="${resetLink}"
              style="
                display: inline-block;
                padding: 12px 25px;
                background-color: #555555;
                color: #ffffff;
                text-decoration: none;
                border-radius: 6px;
                font-weight: bold;
              "
            >
              Reset Password
            </a>

          </div>

          <p>
            This password reset link will expire in
            <strong>15 minutes</strong>.
          </p>

          <p>
            If you did not request a password reset,
            you can safely ignore this email.
          </p>

          <p style="margin-top: 30px;">
            Regards,<br />
            <strong>INCIDEX Team</strong>
          </p>

        </div>
      `,
    });

    res.status(200).json({
      message: "Password reset link has been sent to your email",
    });

  } catch (error) {

    console.error("Forgot password error:", error);

    res.status(500).json({
      message: "Unable to send password reset email",
    });
  }
});


// RESET PASSWORD

router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const { password, confirmPassword } = req.body;

    if (!password || password.trim() === "") {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    if (!confirmPassword || confirmPassword.trim() === "") {
      return res.status(400).json({
        message: "Confirm password is required",
      });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,20}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be 8 to 20 characters and contain uppercase, lowercase, number and special character",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    // Verify reset token

    let decoded;

    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    } catch (error) {

      return res.status(400).json({
        message: "Invalid or expired reset link",
      });
    }

    // Find user

    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset link",
      });
    }

    // Check expiry

    if (
      !user.resetPasswordExpires ||
      user.resetPasswordExpires < new Date()
    ) {
      return res.status(400).json({
        message: "Reset link has expired",
      });
    }

    // Hash new password

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    user.password = hashedPassword;

    // Clear reset token

    user.resetPasswordToken = null;

    user.resetPasswordExpires = null;

    await user.save();

    res.status(200).json({
      message: "Password changed successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
});


module.exports = router;