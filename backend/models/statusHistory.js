const mongoose=require('mongoose');

const statusHistorySchema=new mongoose.Schema(
  {
    caseId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"CrimReport",
      required:true,
    },
    status:{
      
    }
  }
)