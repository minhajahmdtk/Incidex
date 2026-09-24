const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

//REGISTER USER

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

    //Name validation

    const nameRegex = /^[A-Za-z ]{2,20}$/

    if (!nameRegex.test(name.trim())) {
      return res.status(400).json({
        message:
          "Name must contain only letters and spaces and be 2 to 20 characters long",
      });
    }

    //Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    //phone validation

    const phoneRegex = /^[6-9][0-9]{9}$/;
    if (!phoneRegex.test(phone.trim())) {
      return res.status(400).json({
        message: "Please enter a valid phone number"
      })
    }

    // Password validation

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be 8 to 20 characters and contain uppercase, lowercase, number and special character",
      });
    }

    // Confirm password

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    // Check email
    const emailExist = await User.findOne({
      email: email.toLowerCase().trim(),
    });
    if (emailExist) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }


    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: hashedPassword,
    })
    await user.save();
    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


//LOGIN 

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    //validate email and password

    if (!email || email.trim() === "") {
      return res.status(400).json({
        message: "Email is required"
      })
    }

    if (!password || password.trim() === "") {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim()
    })
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      })
    }

    // Comparing password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Creating JWT
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


module.exports = router;