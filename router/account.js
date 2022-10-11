import express from "express";
import Account from "../model/account.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import fs from "fs";
import Todo from "../model/todo.js"
import Challeange from "../model/challenge.js"
import Data from "../model/data.js";
const router = express.Router();
dotenv.config();


// 로그인
router.post("/auth", async (req, resp) => {
    let response = await Account.findOne({ userId: req.body.userId })
    if (response) {
        let pwd = await bcrypt.compare(req.body.password, response.password)
        if (pwd) {
            //===========================================================
            const token = jwt.sign({userId:response.userId},process.env.SECRET_KEY,{expiresIn: "14d"})
            resp.json({ registered: true,data:response,token })
        } else {
            resp.status(401).json({ registered: false,data:"password error" })
        }
    } else {
        resp.status(401).json({ registered: false })
    }


});

// 비밀번호 변경

router.put("/changepassword",async(req,resp)=>{
    let data = await Account.findOne({userId : req.body.userId});
    try {
        let pwd = await bcrypt.compare(req.body.password, data.password)
        if(pwd){
            let password = await bcrypt.hash(req.body.changepassword, 10)
            let response = await Account.updateOne({userId:req.body.userId},{$set:{password:password}})
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
        console.log(req.body);
        let response = await Account.create({
            userId: req.body.userId,
            password: password,
            name: req.body.name,
        });
        console.log(response);
        const token = jwt.sign({userId:response.userId},process.env.SECRET_KEY,{expiresIn: "14d"})
        resp.json({ type: true,data:response,token });
    } catch (e) {
        resp.status(401).json({ result: false,message:e })
    }

});


// 회원탈퇴

router.post("/deleteid", async(req,resp)=>{
    try {
            let response = await Account.deleteOne({userId:req.body.userId});
            await Todo.deleteMany({writer:req.body.userId});
            await Challeange.deleteMany({createUser:req.body.userId});
            await Data.deleteMany({image:{$regex:req.body.userId}})
            
            if(fs.existsSync(`public/${req.body.userId}`)){
                fs.rmSync(`public/${req.body.userId}`,{ recursive: true, force: true })
            }
            resp.status(200).json({result:true,data:"Data deleted"})

    } catch(e) {
        console.log(e);
        resp.status(401).json({result:false})
    }


})



//토큰 유효성 검사 
router.post("/valid", async (req, resp) => {
    try{
        const data = jwt.verify(req.body.token.token,process.env.SECRET_KEY);
        const response = await Account.findOne({userId:data.userId});

        resp.status(200).json({result:true, data:response})
    } catch(e){
        resp.status(401).json({result:false})
    }

});






export default router;