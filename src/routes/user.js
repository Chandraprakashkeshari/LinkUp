const express = require("express");
const userRouter = express.Router();


const {UserAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");


//get all  pending connection  request for the loggedin user
userRouter.get("/user/request/received", UserAuth, async (req,res)=>{
    try{
        const loggedinUser = req.user;
        
        const connectionReq =await ConnectionRequest.find({
            toUserId : loggedinUser._id,
            status : "interested",
        }).populate("fromUserId",["firstName","lastName"]);

        res.json({message : "data fetched successfully !! ", data : connectionReq})

    }catch(err){
        req.statusCode  (404).send("ERROR : " + err.message);
    }
})
module.exports= userRouter;