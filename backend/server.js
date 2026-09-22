const express = require("express"); 
const server=express();
const port=3000;
require('dotenv').config();
const db=require('.//config/db');
db();
server.listen(port,()=>{
  console.log(`Server listening on port ${port}`);
})