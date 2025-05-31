const validator = require("validator");

const validateSignupData=(req) =>{
    const {firstName , lastName , emailId , password }=req.body;
    if (!firstName || firstName.length < 4 || firstName.length > 20){
        throw new Error ("name is not valid !");
    } 
   
    else if(!validator.isEmail(emailId)){
            throw new Error("enter a valid email address");
    }
    else if(!validator.isStrongPassword(password)){ // we can change password through encry hash password
        throw new Error("Enter a strong password");
    }
    
};

const validateProfileData = (req) =>{
    const AllowEditField=[
        "firstName",
        "lastName",
        "emailId",
        "age",
        "gender",
        "photoURL",
        "skills",
        "bio",
    ];
    const IsEditAllowed= Object.keys(req.body).every((field)=>
    AllowEditField.includes(field)
    );
    return IsEditAllowed;
}

module.exports={
    validateSignupData,
    validateProfileData,
}