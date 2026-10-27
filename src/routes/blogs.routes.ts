import Router from "express"
import { validatePagination } from "../middlewares/pagination.middleware"
import { validateUserId, validateAnon, validateContent, validateGetComments, validateCreateReplies, validateGetReplies } from "../middlewares/blogs.middleware"
import { 
    getBlogsController, 
    likeBlogController, 
    createCommentsController, 
    getBlogCommentsController,
    getRepliesController,
    createReplyController
} from "../controllers/blogs.controller"

const router = Router()

router.get("", validatePagination, validateUserId ,getBlogsController)

router.all("/like", validateAnon, likeBlogController)
router.post("/comment", validateAnon, validateContent, createCommentsController)
router.get("/comments/:id", validateGetComments, getBlogCommentsController)
router.post("/reply", validateCreateReplies, createReplyController)
router.get("/replies/:id", validateGetReplies, getRepliesController)
export default router