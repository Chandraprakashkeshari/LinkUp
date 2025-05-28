const express = require("express");
const profileRouter= express.Router();
const User=require("../models/user");
const {UserAuth}=require("../middlewares/auth");
const connectDB=require("../config/database");

profileRouter.get("/profile", UserAuth, async (req,res)=>{
    try{
        const user = req.user;
        res.send(user); 
    } catch(err){
        res.status(404).send("UPDATE FAILED:" + err.message);
    }
});

profileRouter.get("/feed",async(req,res)=>{
    try{
        const users= await User.find({});
        res.send(users);
    }
    catch(err){
        res.status(404).send("something went wrong");
    }    
})

module.exports=profileRouter;