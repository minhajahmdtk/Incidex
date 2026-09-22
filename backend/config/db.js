const mongoose=require('mongoose');

const db=async()=>{
  try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected successfully`)
  }catch(error){
    console.log(`MongoDB connection Error:`,error.message);
    process.exit(1);
  }
}

module.exports=db;