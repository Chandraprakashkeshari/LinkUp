const express = require("express");
const userRouter = express.Router();


const {UserAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const USER_SAFE_DATA = " firstName lastName photoURL age gender";


//get all  pending connection  request for the loggedin user;
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

// get all connetion to loggedIn User;
userRouter.get("/user/connections", UserAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;

        const connectionReqs = await ConnectionRequest.find({
            $or: [
                { toUserId : loggedInUser._id , status : "accepted", },
                { fromUserId : loggedInUser._id , status : "accepted",},
            ],  
        }).populate("fromUserId", USER_SAFE_DATA);
       
        const data = connectionReqs.map((row) => row.fromUserId);

        res.json({data: connectionReqs});

    }catch(err){
        res.status(404).send("ERROR : " + err.message);
    }
})
module.exports= userRouter;