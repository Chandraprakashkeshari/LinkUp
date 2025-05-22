const mongoose=require("mongoose");

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
        
    },
    password:{
        type: String,
        required:true,
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female"].includes(value)){
                throw new Error("gender is not allowed");
            }
        },
    },
    age:{
        type:Number,
        min:18,   // age should be >=18
    },
    photoURL:{
        type:String,
        default:"https://i.sstatic.net/l60Hf.png", // by default exist
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



module.exports=mongoose.model("User",UserSchema);