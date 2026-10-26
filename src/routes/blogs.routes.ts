import Router from "express"
import { validatePagination } from "../middlewares/pagination.middleware"
import { validateUserId } from "../middlewares/blogs.middleware"
import { getBlogsController } from "../controllers/blogs.controller"

const router = Router()

router.get("", validatePagination, validateUserId ,getBlogsController)

export default router