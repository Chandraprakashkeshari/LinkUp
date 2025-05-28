const express = require("express");
const UpdateRouter=express.Router();
const User=require("../models/user");
const connectDB=require("../config/database");


UpdateRouter.patch("/user/:userId",async(req,res)=>{
    const  userId=req.params?.userId;
    const data=req.body;
    try{
     const UPDATE_ALLOWED=["userId", "photoURL", "bio","skills","age"];

     const IsUpdateAllowed=Object.keys(data).every((k)=>
      UPDATE_ALLOWED.includes(k)
     );

     if(!IsUpdateAllowed){
        throw new Error ("Update is not Allowed");
     }
     if(data?.skills.length>10){
        throw new Error("skills cannot be more than 10");
     }
     
     const user= await User.findByIdAndUpdate(userId , data,{
        returnDocument:"after",
        runValidators:true,
    });
         console.log(user);
        res.send("user updated successfully");
    }
    catch(err){
        res.status(404).send("UPDATE FAILED:" + err.message);
    }
})
UpdateRouter.delete("/user", async(req,res)=>{
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("user deleted succussfully")
    }
    catch(err){
        res.status(404).send("something went wrong")
    }
});

module.exports = UpdateRouter;