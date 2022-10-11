
import express from "express";
import jwt from "jsonwebtoken";
import Data from "../model/data.js";
import fs from "fs";

const router = express.Router();


// auth token check middelware
// router.use((req, resp, next) => {
//     const authorization = req.get("Authorization");
//     if (!authorization || !authorization.startsWith("Bearer")) {
//         return resp.status(401).json({ result: false, message: "unauthorized error" })
//     }
//     const token = authorization.split(/\s/)[1];

//     try {
//         const payload = jwt.verify(token, process.env.SECRET_KEY);
//         req.logonEmail = payload.email;
//     } catch (e) {
//         console.log(e.message);
//         return resp.status(401).json({ result: false, message: "invalid token" })
//     }

//     next()

// })

// 데이터 등록
router.post("/adddata",async (req,resp)=>{
    let imgData = req.body.imgData;
    let day = req.body.day;
    let emoji = req.body.emoji;
    let comment = req.body.comment;
    let targetId = req.body.targetId;
    let username = req.body.email;

 //  data:URL
 !fs.existsSync(`public/${username}`) && fs.mkdirSync(`public/${username}`);
 let base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
 let dataBuffer = Buffer.from(base64Data, 'base64');
 const filename = `public/${username}/${Date.now()+Math.floor(Math.random()*10)}.png`
 fs.writeFile(filename, dataBuffer, async function(err) {
 if(err){
 resp.json(err);
 }else{
const data = {day:day,targetId:targetId,image:filename,emoji:emoji,comment:comment}
  const response = await Data.create(data);
  resp.json(response);
 }
 });
})

// 데이터 수정
router.put("/updatedata", async(req,resp)=>{
    try{
        let response;
        if(req.body.comment !== null && req.body.emoji !== null){
            response = await Data.updateOne({_id:req.body.id},{$set:{comment:req.body.comment,emoji:req.body.emoji}});
        } else if(req.body.comment !== null){
            response = await Data.updateOne({_id:req.body.id},{$set:{comment:req.body.comment}});
        } else {
            response = await Data.updateOne({_id:req.body.id},{$set:{emoji:req.body.emoji}});
        }
        resp.json({type:true,result:response})
    } catch(e){
        resp.json({type:false,result:e})
    }
})


// 데이터 삭제
router.delete("/deletedata", async(req,resp)=>{
    try {
        let response = await Data.deleteOne({_id:req.body.id}).lean();
        resp.json({type:true,result:"deleted data"})
    } catch(e){
        resp.json({type:false,result:e})
    }

})

// 데이터 하나 불러오기
router.get("/getdata", async(req,resp)=>{
    try{
        let response = await Data.findOne({_id:req.query.id}).lean();
        resp.json({type:true,result:response});
    } catch(e){
        resp.json({type:false});
    }
})

// 데이터 전체 불러오기
router.get("/getalldata",async(req,resp)=>{
    try {
        let response = await Data.find({targetId:req.query.targetId}).sort("day").lean();
        resp.json({type:true,result:response});
    } catch(e){
        resp.json({type:false});
    }
})


export default router;