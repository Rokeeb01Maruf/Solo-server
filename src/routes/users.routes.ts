import Router from "express"
import { validateUser } from "../middlewares/auth.middleware"
import { blogParser } from "../middlewares/upload.middleware"
import { getMeController, createBlogController } from "../controllers/users.controller"

const router = Router()
const images = [{name : "inline", maxCount : 1}, {name : "cover", maxCount : 1}]
router.get("/me", validateUser, getMeController)
router.post("/blog", blogParser.fields(images), validateUser, createBlogController)

export default router