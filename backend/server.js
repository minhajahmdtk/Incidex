const express = require("express"); 
const server=express();
const port=3000;
require('dotenv').config();
const db=require('.//config/db');
db();

//-------------------
// Routes
//-------------------

//User routes

const authRouter=require('./router/authRouter');
const userRouter=require('./router/userRouter');

//Admin routes

const adminRouter=require('./router/adminRouter');

//-------------------
//    Models
//-------------------

//user Model
const userModel = require('./models/user');


//admin Model

const adminModel=require('./models/Admin')

server.use(express.json());

//-------------------
// Mount Routes
//-------------------

//Mount user route

server.use('/user',authRouter);
server.use('/user',userRouter);

//Mount admin route

server.use('/admin',adminRouter);

server.listen(port,()=>{
  console.log(`Server listening on port ${port}`);
})