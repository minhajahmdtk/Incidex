const express=require('express');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const Admin=require('../models/Admin');
const router=express.Router();


//ADMIN LOGIN

router.post('/login',async(req,res)=>{
  const {email,password}=req.body;
  if(!email || email.trim()==""){
    return res.status(400).json({
      message:"email is required"
    })
  };
  if (!password || password.trim()==""){
    return res.status(400).json({
      message:"password is required"
    })
  };

  //validate email

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }


})