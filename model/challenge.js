import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema({
    createAt : {type: Date,default: Date.now()},
    title : String,
    createUser : String,
    isnotification : Boolean,
    hournotification : String,
    isEnd : {type:Boolean,default:false},
},{
    toObject:{
        virtuals:true
    }
})

challengeSchema.virtual("data",{
    localField:"_id",
    ref:"Data",
    foreignField:"targetId"
})

export default mongoose.model("Challenge",challengeSchema);