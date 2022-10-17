import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema({
    createdAt : {type: Date,default: Date.now()},
    title : String,
    createUser : String,
    isnotification : Boolean,
    checked: Boolean,
    hournotification : String,
    isEnd : {type:String,default:"ing"},
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