import express from "express"
import type { Request, Response, NextFunction } from "express"
import auth from "./routes/auth.routes"
import users from "./routes/users.routes"
import pinoHttp from "pino-http"
import { generalRateLimiter } from "./middlewares/rateLimit.middleware"
import logger from "../utils/logger"
import blog from "./routes/blogs.routes"
import swaggerUi from "swagger-ui-express";
import { readFileSync } from "node:fs";
import path from "node:path";
import { parse } from "yaml";

const app = express()

app.use(generalRateLimiter)

app.use(
    pinoHttp({
        logger
    })
)

app.use(express.json())

const openApiDocument = parse(
  readFileSync(
    path.join(process.cwd(), "docs", "openapi.yaml"),
    "utf8"
  )
);

app.use("/", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use("/api/v1/auth", auth)
app.use("/api/v1/users", users)
app.use("/api/v1/blogs", blog)
app.get("/test", (req :Request, res :Response)=>{
    res.status(200).json({
        user_agent : req.headers["user-agent"],
        ip : req.ip
    })
})

app.listen(4000, ()=>{
    console.log(`server is working on http://127.0.0.1:4000`)
})

export default app