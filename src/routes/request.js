const express = require("express");
const requestRouter = express.Router();
const {UserAuth}=require("../middlewares/auth");
const connectDB=require("../config/database");

requestRouter.post("/Sendconnectionreq", UserAuth, async(req,res)=>{
    const user = req.user;
    console.log("sending the connection req!!");
    res.send(user.firstName+ " sent the connection req!");
});

module.exports= requestRouter;