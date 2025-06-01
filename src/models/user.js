const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt=require("bcrypt");
const jwt= require("jsonwebtoken");

const UserSchema= new mongoose.Schema({
    firstName:{
        type:String,
        required:true,    // for essential 
        minLength: 4,    // character should be atlest 4 
        maxLength:30,    // character should be atmost 30 
    },
    lastName:{
        type:String,
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,   //all character should be in lowercse;
        trim:true,        // reduce spacing if email have
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email address: " + value); // for validate the formate of email add correct or not
            }
        },       
        
    },
    password:{
        type: String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("enter a strong password " + value); // for validate the formate of email add correct or not
            }
        },
    },
    gender:{
        type:String,
        enum:{
            value:["male","female"],
            message:`{value} is not a valid a vald gender to enter! `,
        },
        // validate(value){
        //     if(!["male","female"].includes(value)){
        //         throw new Error("gender is not allowed");
        //     }
        // },
    },
    age:{
        type:Number,
        min:18,   // age should be >=18
    },
    photoURL:{
        type:String,
        default:"https://i.sstatic.net/l60Hf.png", // by default exist
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid url address: " + value); // for validate the formate of email add correct or not
            }
        },    
    },
    bio:{
        type:String,
        default:"it is default description about user",
    },
    skills:{
        type:[String],
    },
    createdAt:{
        type:Date,
    },


},
{
  timestamps:true, // this refers to the this account update itself
});

UserSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({ _id: user._id},"LinkUp@VM",{
    expiresIn:"7d",
    });
    return token;
}; 

UserSchema.methods.validatePassword = async function (passwordInputByUser){
    const user =this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(
        passwordInputByUser,
        passwordHash
    );
    return isPasswordValid;
};



module.exports=mongoose.model("User",UserSchema);