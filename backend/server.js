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

//case Routes

const caseRouter=require('./router/caseRouter');

//-------------------
//    Models
//-------------------

//user Model
const userModel = require('./models/user');


//admin Model

const adminModel=require('./models/admin')

//case Model

const crimeReport=require('./models/crimeReport');

server.use(express.json());

//-------------------
// Mount Routes
//-------------------

//Mount user route

server.use('/user',authRouter);
server.use('/user',userRouter);

//Mount admin route

server.use('/admin',adminRouter);


//Mount case route

server.use('/cases',caseRouter)

server.listen(port,()=>{
  console.log(`Server listening on port ${port}`);
})