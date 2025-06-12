const express = require("express");
const userRouter = express.Router();



const {UserAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

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
        })
        .populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);
       
        const info = connectionReqs.map((row) =>{
        if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
            return row.toUserId;
        }
         row.fromUserId
        });

        res.json({info: connectionReqs});

    }catch(err){
        res.status(404).send("ERROR : " + err.message);
    }
});

userRouter.get("/feed" , UserAuth , async(req,res)=>{
    try{
        //User can see all the user's card except:
        //1. his own card
        //2. his connections
        //3. ignored people
        //already sent the connection request

        const loggedInUser = req.user;
        const connectionReq = await ConnectionRequest.find({
            $or:[
                {fromUserId : loggedInUser._id},
                {toUserId : loggedInUser._id},
            ]
        }).select("fromUserId  toUserId" );

        const hideUsersFromFeed = new Set();
        connectionReq.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());     
        });

        

        const users = await User.find({
        $and:[    
            {_id: {$nin : Array.from(hideUsersFromFeed) } },
            {_id: {$ne : loggedInUser._id} },

        ],
        }).select(USER_SAFE_DATA);


        res.send(users);

    }catch(err){
        res.status(404).json({message: err.message});    }
})
module.exports= userRouter;