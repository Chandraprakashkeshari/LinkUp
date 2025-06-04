const express = require("express");
const requestRouter = express.Router();
const connectDB=require("../config/database");

const {UserAuth}=require("../middlewares/auth");
const connectionRequest=require("../models/connectionRequest");
const { connection } = require("mongoose");
const User = require("../models/user");


requestRouter.post("/request/send/:status/:toUserId", UserAuth, async(req,res)=>{
   try{
     const fromUserId= req.user._id;
     const toUserId=req.params.toUserId;
     const status=req.params.status;

     const allowedStatus = ["ignored","interested"];

     if(!allowedStatus.includes(status)){
      return res.status(404).json({message:".invalid status type: "+status }); 
     }

     const toUser = await User.findById(toUserId);
     if(!toUser){
      return res.status(404).json({ message: "user not found"});
     }

     // if there is an existing connection request

     const existingConnectionRequest = await connectionRequest.findOne({
      $or: [
         {fromUserId,toUserId},
         {fromUserId:toUserId,toUserId:fromUserId},
      ],
     });
     if(existingConnectionRequest){
      return res.status(404).send({message:"connetion Request is already exist !! "})
     }

     const  ConnectionRequest=new connectionRequest({
        fromUserId,
        toUserId,
        status,
     });

     const data = await ConnectionRequest.save();

     res.json({
        message:
        req.user.firstName+ " is  " + status + " in  " + toUser.firstName,
        data,
     });
   }catch(err){
    res.status(404).send("ERROR : "+ err.message);  
   }
});

module.exports= requestRouter;