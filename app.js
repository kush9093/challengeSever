import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import account from "./router/account.js";
import challenge from "./router/challenge.js";
import data from "./router/data.js"
import todo from "./router/todo.js"
const app = express();
dotenv.config()
app.use(cors());
app.use(morgan("short"))
app.use(express.urlencoded({extended:true,limit:"50mb"}));
app.use(express.json({limit:"50mb"}));
app.use("/public",express.static("public"))
app.use("/api/account",account);
app.use("/api/challenge",challenge);
app.use("/api/data",data)
app.use("/api/todo",todo)

mongoose.connect(process.env.MONGODB_URI,{dbName:"challengers"});



app.listen(8080,()=>{
    console.log("[SERVER] START...")
})


/*
    cors
    morgan
    express
    mongoose
    mongodb
    dotenv
    jsonwebtoken

    bcrypt

*/