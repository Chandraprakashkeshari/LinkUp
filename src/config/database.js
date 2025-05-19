const mongoose=require('mongoose');

const connectDB = async()=>{
    await mongoose.connect(
        "mongodb+srv://Cpkeshari04:1358141110@cluster0.tiznz.mongodb.net/DEVTINDER" //connect to the clusters
    );
};


module.exports=connectDB

