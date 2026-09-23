const express=require('express');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const User=require('../models/user');

const router=express.Router();

//REGISTER USER

// router.post('/register',async(req,res)=>{
//   try{
//     const {name,email,phone,password,confirmPassword}=req.body;

//     if(!name || !email || !phone|| !password || !confirmPassword){
//       return res.status(400).json({
//         message:"All fields are required"
//       });
//     }

//   }
// })
