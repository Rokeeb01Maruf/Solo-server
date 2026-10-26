import { getBlogsService } from "../services/blogs.service"
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
        return res.status(200).json({
            success : true,
            message : "blogs fetched successfully",
            data : {
                blogs : liked,
                pagination : res.locals.pagination,
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