const express=require('express');
const jwt=require('jsonwebtoken');
const User=require('../models/user');
const CrimeReport=require('../models/crimeReport');


const router=express.Router()

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