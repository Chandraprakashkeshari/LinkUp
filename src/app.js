const express = require("express");
const connectDB=require("./config/database");
const app=express();
const User=require("./models/user");
const {validateSignupData} = require("./utils/validaton");
const bcrypt = require("bcrypt");

app.use(express.json())

app.get("/user", async(req,res)=>{
    const userEmail=req.query.emailId;
    try{
        const xyz= await User.findOne({emailId:userEmail});
        res.send(xyz);
    }    
    //   const users = await User.find({emailId: userEmail});
    //   if(users.length===0){
    //     res.status(404).send("user not found")
    //   }
    //   else{
    //     res.send(users)
    //   }
    // }
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

// app.delete("/user", async(req,res)=>{
//     const userId = req.body.userId;
//     try{
//         const user = await User.findByIdAndDelete(userId);
//         res.send("user deleted succussfully")
//     }
//     catch(err){
//         res.status(404).send("something went wrong")
//     }
// });


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
    const isPasswordValid = await bcrypt.compare(password,user.password);

    if(isPasswordValid){
        res.send("login successfully !!")
    }else{
        throw new Error ("Invalid credentials")
    }
   } catch(err){
       res.status(400).send("ERROR: "+ err.message);
   }


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




















// const {adminAuth,UserAuth}=require("./middlewares/a")
// const app=express(); 
//  //now I am creating a new express.js application

// app.use("/admin",adminAuth)
// // app.use("/user",UserAuth),(req,res)
// app.post("/user/login",(req,res)=>{
//     res.send("user logged in successfully");
// })

// app.get("/user/getAllData",UserAuth,(req,res)=>{
//    res.send("all data is sent")
// });
// app.get("/admin/deletedaUser",(req,res)=>{
//     res.send("all data is deleted ");
// });



// there are so many complex operation you can try..
// app.get("/ab?c",(req,res)=>{// abc ,ac both are work mean b is option(if we use + it mean abc,abbc abbbc ... work)
//     res.send({firstname:"vikesh",lastname:"keshari"});//this will only handle get call to /user.
// })
// app.get("/user",(req,res)=>{
//     console.log(req.query );
//     res.send({firstname:"vikesh",lastname:"keshari"});
// })
// app.get("/user/:userID/:name/:password",(req,res)=>{
//     console.log(req.params );
//     res.send({firstname:"vikesh",lastname:"keshari"});
// })

// app.post("/user",(req,res)=>{//saving data to DB.
//     res.send("data is successfully saved to the data base");// this will handle post call to /user only.
// })
// app.delete("/user",(req,res)=>{
//     res.send("data is deleted")//this will handle delete call to /user only .
// })

// app.use("/hello/3",(req,res)=>{  // this function is known as request handler for handle the server;
//     res.send("sparsh singh is at ayodhya")
// });  
// app.use("/hello",(req,res)=>{  // this function is known as request handler for handle the server;
//     res.send("sparsh singh is at allahabad")
// });

// app.use("/test",(req,res)=>{  // this function is known as request handler for handle the server;
//     res.send("sparsh singh is at gkp ")
// }); 



//app.listen(3000);  //I have to add listen server so that anybody can connect to us.
//or
