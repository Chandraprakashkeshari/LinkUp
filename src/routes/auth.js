const express= require("express")
const authRouter= express.Router();
const User=require("../models/user");
const {validateSignupData} = require("../utils/validaton");
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken");
const {UserAuth}=require("../middlewares/auth");
const connectDB=require("../config/database");


authRouter.post("/signup",async(req,res)=>{
    try{
    //validation of data
    validateSignupData(req);

    
    const { firstName, lastName, emailId, password}= req.body;
    
    // encrypt password
    
    const passwordHash = await bcrypt.hash(password,10);
    console.log(passwordHash);
    
    //creating a new instance of an User
    const Userobj= new User({
        firstName,
        lastName,
        emailId,
        password:passwordHash,
    });
    
    await  Userobj.save();
    res.send("users added successfully");
    }
    catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
});

authRouter.post("/login",async(req,res)=>{
  
   try{
    const {emailId,password}=req.body;

    const user = await User.findOne({emailId:emailId});
    if(!user){
        throw new Error("Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);

    if(isPasswordValid){

    //created a jwt token
    const token = await user.getJWT();
    

    //add the token to cookie and the response back to the user
    res.cookie("token", token, 
    {expires: new Date(Date.now()+ 8*360000),
    });

    res.send("login successfully !!")
    }else{
        throw new Error ("Invalid credentials")
    }
   } catch(err){
       res.status(400).send("ERROR: "+ err.message);
   }


});

authRouter.post("/logout",async(req,res)=>{
    res.cookie("token", null,{
        expires: new Date(Date.now()),
    });
    res.send();
});


module.exports=authRouter;