import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    comment:String,
    isEnd:Boolean,
    writer:String,
    createAt:{type:Date,default:Date.now}
})



export default mongoose.model("todo",todoSchema)