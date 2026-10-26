import { 
    getBlogsService,
    likeBlogService,
    unLikeBlogService
 } from "../services/blogs.service"
import { Request, Response } from "express"
import logger from "../../utils/logger"

export const getBlogsController = async(req :Request, res :Response) => {
    const { id } = res.locals
    try{
        const blogs = await getBlogsService(res.locals.pagination)
        const liked = blogs.map((blog)=>({
            ...blog, liked : blog.likes.some((e)=> e.likerId === id)
        }))
        logger.info("blogs retrieved successfully")
        res.locals.pagination.retrieved = blogs.length
        let anonId;
        if(id === "anon"){
            anonId = crypto.randomUUID()
        }else{
            anonId = id
        }
        return res.status(200).json({
            success : true,
            message : "blogs fetched successfully",
            data : {
                blogs : liked,
                pagination : res.locals.pagination,
                anonId : anonId
            }
        })
    }catch(error :any){
        logger.error({err : error}, "blogs fetching aborted: internal server error")
        return res.status(500).json({
            success : false,
            message : "internal server error",
            error : error.message
        })
    }
}

export const likeBlogController = async (req :Request, res :Response) => {
    const { anonId, blogId } = req.body
    if(req.method === "POST"){
        try{
            const blog = await likeBlogService(blogId, anonId)
            logger.info("user liked this post successfully")
            return res.status(200).json({
                success : true,
                message : "you liked this blog",
                data : {
                    blog : blog,
                    anonId : anonId
                }
            })
        }catch(error :any){
            logger.warn({error : error}, "post like failed: internal server error")
            return res.status(500).json({
                success : true,
                message : "internal server error",
                error : error.message
            })
        }
    }else if(req.method === "DELETE"){
        try{
            const blog = await unLikeBlogService(blogId, anonId)
            return res.status(200).json({
                success : true,
                message : "you successfully unlike the blog",
                data : {
                    blog : blog,
                    anonId : anonId
                }
            })
        }catch(error :any){
            logger.info({error : error}, "unlike failed : internal server error")
            return res.status(500).json({
                success : true,
                message : "internal server error",
                error : error.message
            })
        }
    }
}