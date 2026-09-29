import express from "express"
import type { Request, Response, NextFunction } from "express"
import auth from "./routes/auth.routes"

const app = express()

app.use(express.json())

app.get("/", (req :Request, res :Response, next:NextFunction)=>{
    res.send("server is working")
})

app.use("/api/v1/auth", auth)

app.listen(4000, ()=>{
    console.log(`server is working on http://127.0.0.1:4000`)
})