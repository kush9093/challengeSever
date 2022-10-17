
import express from "express";
import jwt from "jsonwebtoken";
import Challenge from "../model/challenge.js";
import Data from "../model/data.js";
import fs from "fs";

const router = express.Router();




// auth token check middelware
router.use((req, resp, next) => {
    const authorization = req.get("Authorization");
    if (!authorization || !authorization.startsWith("Bearer")) {
        return resp.status(401).json({ result: false, message: "unauthorized error" })
    }
    const token = authorization.split(/\s/)[1];

    try {
        const payload = jwt.verify(token, process.env.SECRET_KEY);
        req.logonEmail = payload.userId;
    } catch (e) {
        console.log(e.message);
        return resp.status(401).json({ result: false, message: "invalid token" })
    }

    next()

})



// 챌린지 생성
router.post("/addchallenge",async (req,resp)=>{
    try{
        let response = await Challenge.create({
            title:req.body.title,
            createUser:req.body.userId,
            isnotification : req.body.isnotification,
            checked:req.body.checked,
            hournotification : req.body.hournotification,
        })
        resp.json({type:true,result:response})
    }catch(e) {
        resp.json({type:false,result:e})
    }
})

// 챌린지 전체 불러오기(진행여부에따라)
router.post("/readchallenge", async(req,resp)=>{
    try{
        let response = await Challenge.find({$and:[{createUser:req.body.userId}]}).populate("data").sort("-createdAt").lean();
        resp.json({type:true,result:response});
    } catch(e) {
        resp.json({type:false,result:e})
    }

})


// 챌린지 하나 불러오기 
router.post("/readonechallenge", async(req,resp)=>{
    try{
        let response = await Challenge.find({"_id":req.body.id}).populate("data").lean();
        resp.json({type:true,result:response});
    } catch(e) {
        resp.json({type:false,result:e})
    }

})


// 챌린지 시간 수정 하기 
router.put("/updatechallenge", async(req,resp)=>{
    try{
        let response;
        if(req.body.isnotification == true){
            response = await Challenge.updateOne({"_id":req.body.id},
            {$set:{hournotification:req.body.hournotification,isnotification:req.body.isnotification,checked:req.body.checked}})
        } else {
            response = await Challenge.updateOne({"_id":req.body.id},
            {$set:{isnotification:req.body.isnotification,checked:req.body.checked}})
        }
        if(response.acknowledged===false){
            resp.json({type:false})
        } else {
            resp.json({type:true,data:response});
        }
    }catch(e){
        resp.json({type:false})
    }

})




// 챌린지 삭제
router.post("/deletechallenge",async(req,resp)=>{
    try{
        let linkdata = await Data.find({targetId:req.body.id})
        linkdata.forEach((elm)=>{
            fs.unlinkSync(elm.image)
        })
        await Data.deleteMany({targetId:req.body.id})
        let response = await Challenge.deleteOne({_id:req.body.id}).lean()
        resp.json({type:true,result:"deleted challenge"});
    } catch(e) {
        resp.status(401).json({type:false,result:e})
    }
})





export default router;