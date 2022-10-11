import express from "express";
import Account from "../model/account.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import fs from "fs";
import Todo from "../model/todo.js"
import Challeange from "../model/challenge.js"
import Data from "../model/data.js"
const router = express.Router();
dotenv.config();


// 로그인
router.post("/auth", async (req, resp) => {
    let response = await Account.findOne({ email: req.body.email })
    if (response) {
        let pwd = await bcrypt.compare(req.body.password, response.password)
        if (pwd) {
            //===========================================================
            const token = jwt.sign({email:response.email},process.env.SECRET_KEY,{expiresIn: "14d"})
            resp.json({ result: true,message:response,token })
        } else {
            resp.json({ result: false,message:"password error" })
        }
    } else {
        resp.json({ result: false })
    }


});

// 비밀번호 변경

router.put("/changepassword",async(req,resp)=>{
    let data = await Account.findOne({email : req.body.email});
    try {
        let pwd = await bcrypt.compare(req.body.password, data.password)
        if(pwd){
            let password = await bcrypt.hash(req.body.changepassword, 10)
            let response = await Account.updateOne({email:req.body.email},{$set:{password:password}})
            resp.status(200).json({result:true,data:"change complete"})
        } else {
            resp.status(401).json({result:false,data:"Password Error"})
        }
    } catch(e) {
        resp.status(401).json({result:false})
    }

})



// 회원가입
router.post("/register", async (req, resp) => {
    let password = await bcrypt.hash(req.body.password, 10)
    try {
        let response = await Account.create({
            email: req.body.email,
            password: password,
            name: req.body.name,
        });
        const token = jwt.sign({email:response.email},process.env.SECRET_KEY,{expiresIn: "14d"})
        resp.json({ result: true,result:response,token });
    } catch (e) {
        resp.status(401).json({ result: false,message:e })
    }

});


// 회원탈퇴

router.delete("/delete", async(req,resp)=>{
    let data = await Account.findOne({email : req.body.email});
    try {
        let pwd = await bcrypt.compare(req.body.password, data.password)
        if(pwd){
            let response = await Account.deleteOne({email:req.body.email});
            await Todo.deleteMany({writer:req.body.email});
            await Challeange.deleteMany({createUser:req.body.email});
            await Data.deleteMany({image:{$regex:req.body.email}})
            
            if(fs.existsSync(`public/${username}`)){
                fs.rmSync(`public/${username}`,{ recursive: true, force: true })
            }
            resp.status(200).json({result:true,data:"Data deleted"})
        } else {
            resp.status(401).json({result:false,data:"Password Error"})
        }
    } catch(e) {
        resp.status(401).json({result:false})
    }


})



//토큰 유효성 검사 
router.post("/valid", async (req, resp) => {
    console.log(req.body);
    try{
        const data = jwt.verify(req.body.token,process.env.SECRET_KEY);
        resp.status(200).json({result:true, owner:data.email})
    } catch(e){
        resp.status(401).json({result:false})
    }

});






export default router;