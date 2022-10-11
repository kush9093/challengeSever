import mongoose from "mongoose";


const accountSchema = new mongoose.Schema({
    userId:{type: String,unique:true},
    password:String,
    name:String,
});


export default mongoose.model("Account",accountSchema)