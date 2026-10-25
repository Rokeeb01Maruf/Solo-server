import { getBlogsService } from "../services/blogs.service"
import { Request, Response } from "express"
import logger from "../../utils/logger"

export const getBlogsController = async(req :Request, res :Response) => {
    try{
        const blogs = await getBlogsService(res.locals.pagination)
        logger.info("blogs retrieved successfully")
        res.locals.pagination.retrieved = blogs.length
        return res.status(200).json({
            success : true,
            message : "blogs fetched successfully",
            data : {
                blogs : blogs,
                pagination : res.locals.pagination
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