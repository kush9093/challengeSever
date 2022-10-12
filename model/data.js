import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
    day:String,
    targetId:mongoose.Schema.Types.ObjectId,
    createAt:{type:Date,default:Date.now},
    emoji:String,
    image:String,
    comment:String,
    createUser:String,
    confirm:{type:Boolean,default:true}
})

export default mongoose.model("Data",dataSchema);