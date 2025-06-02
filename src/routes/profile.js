const express = require("express");
const profileRouter= express.Router();
const User=require("../models/user");
const connectDB=require("../config/database");
const jwt=require("jsonwebtoken");

const {UserAuth}=require("../middlewares/auth");
const {validateProfileData}=require("../utils/validaton");


profileRouter.get("/profile", UserAuth, async (req,res)=>{
    try{
        const user = req.user;
        res.send(user); 
    } catch(err){
        res.status(404).send("UPDATE FAILED: " + err.message);
    }
});

profileRouter.patch("/profile/edit", UserAuth,async(req,res)=>{
   
    try{

    
      
      
      if(!validateProfileData(req)){
        throw new Error("Invalid edit request");
      }
      const loggedInUser = req.user;
      

    Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]));
    console.log(loggedInUser);
    await loggedInUser.save();
    
    console.log(`${loggedInUser.firstName} , your profile has been updated successfully`);
    res.json({
        message: `${loggedInUser.firstName}, your profile  has been updated successfully`,
        data: loggedInUser, 
    });
      
    }
    catch(err){
        res.status(404).send("UPDATE FAILED: " + err.message);
    }
});





module.exports=profileRouter;