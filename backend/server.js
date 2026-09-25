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

//-------------------
//    Models
//-------------------

//user Model
const userModel = require('./models/user');

server.use(express.json());

//-------------------
// Mount Routes
//-------------------

//Mount user route

server.use('/user',authRouter);
server.use('/user',userRouter);


server.listen(port,()=>{
  console.log(`Server listening on port ${port}`);
})