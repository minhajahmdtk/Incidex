const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const router = express.Router();

//VERIFY ADMIN ADMIN

function verifyAdmin(req,res,next){
  const token=req.headers.token;
  try{
    if(!token){
      return res.status(401).json({
        message:'Unauthorized request'
      });
    }

    const payload=jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (payload.role !== "admin") {
      return res.status(403).json({
        message: 'Admin access required',
      });
    }

  }catch(error){
    return res.status(401).json({
      message:'Invalid or expired token'
    })
  }
}




//ADMIN LOGIN

router.post('/login', async (req, res) => {
  try {


    const { email, password } = req.body;
    if (!email || email.trim() == "") {
      return res.status(400).json({
        message: "email is required"
      })
    };
    if (!password || password.trim() == "") {
      return res.status(400).json({
        message: "password is required"
      })
    };

    //validate email

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    //check admin

    const admin = await Admin.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid Email or password"
      })
    }

    //comparing password

    const passwordMatch = await bcrypt.compare(
      password, admin.password
    )
    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      })
    };

    //creating JWT

    const token = jwt.sign({
      id: admin._id,
      email: admin.email,
      role: "admin",
    },
      process.env.JWT_SECRET, {
      expiresIn: "1hr",
    }
    );

    return res.status(200).json({
      message: "admin login successfull",
      token: token,
      admin: {
        id: admin._id,
        email: admin.email,
        role: "admin",
      }
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
});

module.exports=router