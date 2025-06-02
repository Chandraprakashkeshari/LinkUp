const express = require("express");
const requestRouter = express.Router();
const connectDB=require("../config/database");

const {UserAuth}=require("../middlewares/auth");
const connectionRequest=require("../models/connectionRequest");


requestRouter.post("/request/send/:status/:toUserId", UserAuth, async(req,res)=>{
   try{
     const fromUserId= req.user._id;
     const toUserId=req.params.toUserId;
     const status=req.params.status;

     const  ConnectionRequest=new connectionRequest({
        fromUserId,
        toUserId,
        status,
     });

     const data = await connectionRequest.save();

     res.json({
        message:"Connection request sent successfully",
        data,
     });
   }catch(err){
    res.status(404).send("ERROR : "+ err.message);  
   }
});

module.exports= requestRouter;