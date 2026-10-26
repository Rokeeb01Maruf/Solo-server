import { Response, Request, NextFunction } from "express";
import { blogPostSchema } from "../../utils/zod"

export const validateBlogpost = (req :Request, res:Response, next :NextFunction) => {
    const result = blogPostSchema.safeParse(req.body)
    if(result.error) return res.status(400).json({
        success : false,
        message : "bad request",
        error : result.error
    })

    next()
}

