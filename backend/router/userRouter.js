const express=require('express');
const router=express.Router();
const User=require('../models/user');
const jwt=require('jsonwebtoken');


function verifyToken(req,res,next){
  const token=req.headers.token;

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

    req.user = payload;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

//GET THE USER PROFILE

router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

//UPDATE USER PROFILE

router.put('/update',verifyToken,async(req,res)=>{
  try{
    const{
      name,
      email,
      phone
    }=req.body
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


    // Name validation

    const nameRegex = /^[A-Za-z ]{2,20}$/;

    if (!nameRegex.test(name.trim())) {
      return res.status(400).json({
        message:
          "Name must contain only letters and spaces and be 2 to 20 characters long",
      });
    }


    // Email validation

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }


    // Phone validation

    const phoneRegex = /^[6-9][0-9]{9}$/;

    if (!phoneRegex.test(phone.trim())) {
      return res.status(400).json({
        message: "Please enter a valid phone number",
      });
    }

    //check email already exit

     const emailExist = await User.findOne({
      email: email.toLowerCase().trim(),
      _id: { $ne: req.user.id },
    });

    if (emailExist) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }
        // Check phone already exists

    const phoneExist = await User.findOne({
      phone: phone.trim(),
      _id: { $ne: req.user.id },
    });

    if (phoneExist) {
      return res.status(400).json({
        message: "Phone number already exists",
      });
    }

     // Update user

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");


    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }
  res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});


module.exports = router;