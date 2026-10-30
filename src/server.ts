import express from "express"
import type { Request, Response } from "express"
import auth from "./routes/auth.routes.js"
import users from "./routes/users.routes.js"
import { pinoHttp } from "pino-http"
import { generalRateLimiter } from "./middlewares/rateLimit.middleware.js"
import logger from "../utils/logger.js"
import blog from "./routes/blogs.routes.js"
import swaggerUi from "swagger-ui-express";
import { readFileSync } from "node:fs";
import path from "node:path";
import { parse } from "yaml";

const app = express()

app.set("trust proxy", 1)

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

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use("/api/v1/auth", auth)
app.use("/api/v1/users", users)
app.use("/api/v1/blogs", blog)

app.get("/", (req :Request, res :Response)=>{
    res.status(200).send("solo server is working")
})
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