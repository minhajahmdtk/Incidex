const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const User=require('../models/user');
const CrimeReport=require('../models/crimeReport');
const router = express.Router();

//VERIFY ADMIN TOKEN

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
    next();

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


//VIEW ALL USERS

router.get('/users', verifyAdmin, async (req, res) => {

  try {

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      users: users,
    });

  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });

  }
});

//VIEW SINGLE USER

router.get('/users/:id', verifyAdmin, async (req, res) => {

  try {

    const user = await User.findById(req.params.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user: user,
    });

  } catch (error) {

    return res.status(400).json({
      message: error.message,
    });

  }

});

//VIEW ALL CRIME CASES

router.get('/cases', verifyAdmin, async (req, res) => {

  try {

    const cases = await CrimeReport.find()
      .populate('userId', 'name phone')
      .sort({ reportDateTime: -1 });

    return res.status(200).json({
      cases: cases,
    });

  } catch (error) {

    return res.status(400).json({
      message: error.message,
    });

  }

});

//VIEW SINGLE CASE

router.get('/cases/:id', verifyAdmin, async (req, res) => {

  try {

    const Report = await CrimeReport.findOne({
      caseId: req.params.id,
    }).populate(
      'userId',
      'name email phone'
    );

    if (!Report) {
      return res.status(404).json({
        message: 'Case not found',
      });
    }

    return res.status(200).json({
      case: Report,
    });

  } catch (error) {

    return res.status(400).json({
      message: error.message,
    });

  }

});


module.exports=router