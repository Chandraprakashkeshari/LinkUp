const adminAuth=(req,res,next)=>{
        console.log("admin is ready to send or delete data");
        const token="xdz";
        const isAdminAuthorised=token==="xyz";
        if(!isAdminAuthorised){
            res.status(401).send("admin is UnAuthorised");
        }
        else{
            next();
        }
    }
    const UserAuth=(req,res,next)=>{
        console.log("user is ready to send or delete data");
            const token="xjkz";
            const isAdminAuthorised=token==="xyz";
            if(!isAdminAuthorised){
                res.status(401).send("user is UnAuthorised");
            }
            else{
                next();
            }
    }
    module.exports={adminAuth,UserAuth};