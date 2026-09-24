const express = require("express"); 
const server=express();
const port=3000;
require('dotenv').config();
const db=require('.//config/db');
db();

// Routes
const authRouter=require('./router/authRouter');

//models
const userModel = require('./models/user');

server.use(express.json());


server.use('/user',authRouter)
server.listen(port,()=>{
  console.log(`Server listening on port ${port}`);
})