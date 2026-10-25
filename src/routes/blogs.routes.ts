import Router from "express"
import { validatePagination } from "../middlewares/pagination.middleware"
import { getBlogsController } from "../controllers/blogs.controller"

const router = Router()

router.get("/", validatePagination, getBlogsController)

export default router