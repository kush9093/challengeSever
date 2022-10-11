import mongoose from "mongoose";


const accountSchema = new mongoose.Schema({
    email:{type: String, unique : true},
    password:String,
    name:String,
});


export default mongoose.model("Account",accountSchema)