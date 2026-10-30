import Router from "express"
import { validateUser } from "../middlewares/auth.middleware.js"
import { validatePagination } from "../middlewares/pagination.middleware.js"
import { blogParser } from "../middlewares/upload.middleware.js"
import { getMeController, createBlogController, getBlogsbyIdController } from "../controllers/users.controller.js"

const router = Router()
const images = [{name : "inline", maxCount : 1}, {name : "cover", maxCount : 1}]
router.get("/me", validateUser, getMeController)
router.post("/blog", blogParser.fields(images), validateUser, createBlogController)
router.get("/blogs", validatePagination, validateUser, getBlogsbyIdController)

export default router