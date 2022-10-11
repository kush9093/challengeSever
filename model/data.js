import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
    day:String,
    targetId:mongoose.Schema.Types.ObjectId,
    createAt:{type:Date,default:Date.now},
    emoji:String,
    image:String,
    comment:String,
})

export default mongoose.model("Data",dataSchema);