import express from "express"
import type { Request, Response, NextFunction } from "express"
import auth from "./routes/auth.routes"
import users from "./routes/users.routes"
import pinoHttp from "pino-http"
import logger from "../utils/logger"

const app = express()

app.use(
    pinoHttp({
        logger
    })
)

app.use(express.json())

app.get("/", (req :Request, res :Response, next:NextFunction)=>{
    res.send("server is working")
})

app.use("/api/v1/auth", auth)
app.use("/api/v1/users", users)
app.get("/test", (req :Request, res :Response)=>{
    res.status(200).json({
        user_agent : req.headers["user-agent"],
        ip : req.ip
    })
})

app.listen(4000, ()=>{
    console.log(`server is working on http://127.0.0.1:4000`)
})