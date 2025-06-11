
const mongoose= require('mongoose');
const { applyTimestamps } = require('./user');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User",
        required:true,
    },

    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref : "User",
        required:true,
    },

    status:{
        type: String,
        required:true,
        enum:["ignored", "accepted", "interested", "rejected"],
    },
},
{
    timestamps:true,
}
);

connectionRequestSchema.pre("save", function(next){
    const connectionRequest = this;

    //check  if the fromUserId == toUserId

    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Connection request can not be send to yourself! ");
    }
    next();
})

const ConnectionRequestModel = new mongoose.model("connectionRequest", connectionRequestSchema);

module.exports = ConnectionRequestModel;