const express = require("express");
const connectDB=require("./config/database");
const app=express();
const User=require("./models/user");
const {validateSignupData} = require("./utils/validaton");
const bcrypt = require("bcrypt");
const cookieParser = require('cookie-parser');
const jwt=require("jsonwebtoken");
const {UserAuth}=require("./middlewares/auth");


app.use(express.json())
app.use(cookieParser())

app.get("/user", async(req,res)=>{
    const userEmail=req.query.emailId;
    try{
        const xyz= await User.findOne({emailId:userEmail});
        res.send(xyz);
    }    
    
    catch(err){
       res.status(400).send("Something went wrong");
    }
})

app.get("/feed",async(req,res)=>{
    try{
        const users= await User.find({});
        res.send(users);
    }
    catch(err){
        res.status(404).send("something went wrong");
    }    
})

app.delete("/user", async(req,res)=>{
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("user deleted succussfully")
    }
    catch(err){
        res.status(404).send("something went wrong")
    }
});


app.post("/signup",async(req,res)=>{
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

app.post("/login",async(req,res)=>{
  
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

app.get("/profile", UserAuth, async (req,res)=>{
    try{

        
        
        const user = req.user;
        res.send(user); 
    } catch(err){
        res.status(404).send("UPDATE FAILED:" + err.message);
    }
});

app.post("/Sendconnectionreq", UserAuth, async(req,res)=>{
    const user = req.user;
    console.log("sending the connection req!!");
    res.send(user.firstName+ " sent the connection req!");
});

app.patch("/user/:userId",async(req,res)=>{
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

connectDB()
.then(()=>{
    console.log("Database connection is established..");
    app.listen(7777,()=>{
        console.log("Server is successfully listening on port 2000....");
        
    });
})
.catch((err)=>{
    
    console.error("Database cannot be connected");
    console.log(err);
});
