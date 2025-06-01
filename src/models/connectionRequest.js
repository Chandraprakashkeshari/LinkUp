
const mongoose= require('mongoose');
const { applyTimestamps } = require('./user');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
    },

    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
    },

    status:{
        type: String,
        required:true,
        enum:{
            value:["ignored", "accepted", "intersted", "rejected"],
            message:`{value} is incorrect status type`
        }
    }

},
{
    timestamps:true,
}
);

const ConnectionRequestModel = new mongoose.model("connectionRequest", connectionRequestSchema);

module.exports = connectionRequestModel;