
import express from "express";
import jwt from "jsonwebtoken";
import Challenge from "../model/challenge.js";

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
            hournotification : req.body.hournotification,
        })
        resp.json({type:true,result:response})
    }catch(e) {
        resp.json({type:false,result:e})
    }
})

// 챌린지 전체 불러오기
router.get("/readchallenge", async(req,resp)=>{
    try{
        let response = await Challenge.find({createUser:req.query.userId}).populate("data").sort("-createAt").lean();
        resp.json({type:true,result:response});
    } catch(e) {
        resp.json({type:false})
    }

})


// 챌린지 하나 불러오기 
router.get("/readonechallenge", async(req,resp)=>{
    try{
        let response = await Challenge.find({"_id":req.query.id}).populate("data").lean();
        resp.json({type:true,result:response});
    } catch(e) {
        resp.json({type:false})
    }

})


// 챌린지 시간 수정 하기 
router.put("/updatechallenge", async(req,resp)=>{
    try{
        let response = await Challenge.updateOne({"_id":req.body.id},
        {$set:{hournotification:req.body.hournotification}})
        resp.json({type:true,data:response});
    }catch(e){
        resp.json({type:false})
    }

})




// 챌린지 삭제
router.delete("/deletechallenge",async(req,resp)=>{
    try{
        let response = await Challenge.deleteOne({_id:req.body.id}).lean()
        resp.json({type:true,result:"deleted challenge"});
    } catch(e) {
        resp.json({type:false})
    }
})





export default router;