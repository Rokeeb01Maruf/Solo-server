import Router from "express"
import { validatePagination } from "../middlewares/pagination.middleware"
import { validateUserId, validateAnon, validateContent, validateGetComments } from "../middlewares/blogs.middleware"
import { getBlogsController, likeBlogController, createCommentsController, getBlogCommentsController } from "../controllers/blogs.controller"

const router = Router()

router.get("", validatePagination, validateUserId ,getBlogsController)

router.all("/like", validateAnon, likeBlogController)
router.post("/comment", validateAnon, validateContent, createCommentsController)
router.get("/comments/:id", validateGetComments, getBlogCommentsController)
export default router