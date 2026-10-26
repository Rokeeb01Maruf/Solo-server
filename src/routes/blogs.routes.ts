import Router from "express"
import { validatePagination } from "../middlewares/pagination.middleware"
import { validateUserId, validateAnon } from "../middlewares/blogs.middleware"
import { getBlogsController, likeBlogController } from "../controllers/blogs.controller"

const router = Router()

router.get("", validatePagination, validateUserId ,getBlogsController)

router.all("/like", validateAnon, likeBlogController)
export default router