import {
    getBlogsService,
    likeBlogService,
    unLikeBlogService,
    getBlogCommentsService,
    createCommentService,
    createReplyService,
    getRepliesService
} from "../services/blogs.service.js"
import { Request, Response } from "express"
import logger from "../../utils/logger.js"

export const getBlogsController = async (req: Request, res: Response) => {
    const { id } = res.locals
    try {
        const blogs = await getBlogsService(res.locals.pagination)
        const liked = blogs.map((blog) => ({
            ...blog, liked: blog.likes.some((e) => e.likerId === id)
        }))
        logger.info("blogs retrieved successfully")
        res.locals.pagination.retrieved = blogs.length
        let anonId;
        if (id === "anon") {
            anonId = crypto.randomUUID()
        } else {
            anonId = id
        }
        return res.status(200).json({
            success: true,
            message: "blogs fetched successfully",
            data: {
                blogs: liked,
                pagination: res.locals.pagination,
                anonId: anonId
            }
        })
    } catch (error: any) {
        logger.error({ err: error }, "blogs fetching aborted: internal server error")
        return res.status(500).json({
            success: false,
            message: "internal server error",
            error: error.message
        })
    }
}

export const likeBlogController = async (req: Request, res: Response) => {
    const { anonId, blogId } = req.body
    if (req.method === "POST") {
        try {
            const blog = await likeBlogService(blogId, anonId)
            logger.info("user liked this post successfully")
            return res.status(200).json({
                success: true,
                message: "you liked this blog",
                data: {
                    blog: blog,
                    anonId: anonId
                }
            })
        } catch (error: any) {
            logger.warn({ error: error }, "post like failed: internal server error")
            return res.status(500).json({
                success: true,
                message: "internal server error",
                error: error.message
            })
        }
    } else if (req.method === "DELETE") {
        try {
            const blog = await unLikeBlogService(blogId, anonId)
            return res.status(200).json({
                success: true,
                message: "you successfully unlike the blog",
                data: {
                    blog: blog,
                    anonId: anonId
                }
            })
        } catch (error: any) {
            logger.info({ error: error }, "unlike failed : internal server error")
            return res.status(500).json({
                success: true,
                message: "internal server error",
                error: error.message
            })
        }
    }
}

export const createCommentsController = async (req: Request, res: Response) => {
    const { blogId, anonId, content } = req.body
    try {
        let data: {
            blogId: string,
            anonId: string,
            content: string,
            username: string | undefined
        }
        if (req.body.username) {
            data = {
                blogId: blogId,
                anonId: anonId,
                content: content,
                username: req.body.username.toLowerCase()
            }
        } else {
            data = {
                blogId: blogId,
                anonId: anonId,
                content: content,
                username: undefined
            }
        }
        const comments = await createCommentService(data)
        logger.info("comments")
        return res.status(201).json({
            success: true,
            message: "comments created successfully",
            data: {
                comments: comments,
                anonId: anonId
            }
        })
    } catch (error: any) {
        logger.error({ error: error }, `comment creation failed : ${error.message}`)
        return res.status(500).json({
            success: false,
            message: "internal server error",
            error: error.message
        })
    }

}

export const getBlogCommentsController = async (req: Request, res: Response) => {
    const { anonId, blogId } = res.locals
    try {
        const comments = await getBlogCommentsService(blogId)
        logger.info("comments retrieved successfully")
        return res.status(200).json({
            success: true,
            message: "comments fetched successfully",
            data: {
                comments: comments,
                anonId: anonId
            }
        })
    } catch (error: any) {
        logger.error({ error: error }, `comments retrieved failed : ${error.message}`)
        return res.status(500).json({
            success: false,
            message: "internal server error",
            error: error.message
        })
    }
}

export const createReplyController = async(req :Request, res :Response) => {
    const { anonId, content, commentId, username }  = res.locals
    const data = { anonId : anonId, content : content, commentId : commentId, username : username }
    try{
        const replies = await createReplyService(data)
        logger.info("user left a comment successfully")
        return res.status(201).json({
            success : true,
            message : "you successfully left a reply",
            data : {
                replies : replies,
                anonId : anonId
            }
        })
    }catch(error :any){
        logger.error({error : error}, error.message)
        return res.status(500).json({
            success : false,
            message : "internal server error",
            error : error.message
        })
    }
}

export const getRepliesController = async(req :Request, res :Response) => {
    const { anonId, commentId } = res.locals
    try{
        const replies = await getRepliesService(commentId)
        logger.info("replies retrieved successfully")
        return res.status(200).json({
            success : false,
            message : "replies retrieved successfully",
            data : {
                replies : replies,
                anonId : anonId
            }
        })
    }catch(error :any){
        logger.error({error : error}, error.message)
        return res.status(500).json({
            success : false,
            message : "internal server error",
            error : error.message
        })
    }
}