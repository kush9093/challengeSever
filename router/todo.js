import express from "express";
import jwt from "jsonwebtoken";
import Todo from "../model/todo.js";


const router = express.Router();

// auth token check middelware
router.use((req, resp, next) => {
    const authorization = req.get("Authorization");
    console.log("Author",authorization)
    if (!authorization || !authorization.startsWith("Bearer")) {
        return resp.status(401).json({ result: false, message: "unauthorized error" })
    }
    const token = authorization.split(/\s/)[1];

    try {
        const payload = jwt.verify(token, process.env.SECRET_KEY);
        req.logonuserId = payload.userId;
    } catch (e) {
        console.log(e.message);
        return resp.status(401).json({ result: false, message: "invalid token" })
    }

    next()

})

// todo 생성
router.post("/addtodo", async (req, resp) => {
    const obj = { todoText: req.body.todoText, ing: false, writer: req.body.writer };
    try {
        let response = await Todo.create(obj);
        console.log(response)
        resp.json({ type: true, result: response })
    } catch (e) {
        console.log(e);
        resp.json({ type: false, result: e });
    }
})

// todo 전체 불러오기
router.post("/getalltodo",async (req,resp)=>{
    try {
        let response = await Todo.find({writer:req.body.writer}).sort("createAt").lean();
        resp.json({type:true,result:response})
    } catch(e){
        resp.json({type:false,result:e});
    }
})

// 완료여부에따라 todo 불러오기
router.post("/getcompletedtodo",async (req,resp)=>{
    try {
        let response = await Todo.find({$and:[{writer:req.body.writer},{ing:req.body.ing}]}).sort("createAt").lean();
        resp.json({type:true,data:response})
    } catch(e){
        resp.json({type:false,result:e});
    }
})


// todo 수정
router.put("/updatetodo",async(req,resp)=>{
    try{
        let response = await Todo.updateOne({_id:req.body.id},{$set:{comment:req.body.comment}});
        resp.json({type:true,result:response});
    } catch(e){
        resp.json({type:false,result:e})
    }
})

// todo 완료
router.put("/completedtodo",async(req,resp)=>{
    try{
        let response = await Todo.updateMany({_id:{$in:req.body.id}},{$set:{isEnd:req.body.isend}});
        resp.json({type:true,result:response});
    } catch(e){
        resp.json({type:false,result:e})
    }
})


// todo 삭제
router.delete("/deletetodo",async(req,resp)=>{
    try{
        let response = await Todo.deleteMany({_id:{$in:req.body.id}});
        resp.json({type:true,result:"deleted todo"})
    } catch(e){
        resp.json({type:false,result:e})
    }
})


export default router;