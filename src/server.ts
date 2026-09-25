import express from "express"
import type { Request, Response } from "express"

const app = express()

app.get("/", (req :Request, res :Response)=>{
    res.send("server is working")
})

app.listen(4000, ()=>{
    console.log(`server is working on http://127.0.0.1:4000`)
})