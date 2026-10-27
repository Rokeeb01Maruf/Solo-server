import { Response, Request, NextFunction } from "express"
import { getBlogSchema } from "../../utils/zod"

export const validateUserId = (req :Request, res :Response, next :NextFunction) => {
        const authHeader = req.get("authorization")
        if(authHeader){
            if(authHeader.split(" ")[0] !== "Bearer"){
                return res.status(401).json({
                    success : true,
                    message : "Unauthorized",
                    error : "user is unauthorized"
                })
            }
            const id = authHeader.split(" ")[1]
            if(id){
                const validateUuid = getBlogSchema.safeParse({id : id})
            
                if(!validateUuid.success) return res.status(400).json({
                    success : false,
                    message : "bad request",
                    error : validateUuid.error.issues
                })

                res.locals.id = id
            }
        }else{
            res.locals.id = "anon"
        }
    
    next()
}

export const validateAnon = (req :Request, res :Response, next :NextFunction) => {
    try{
        const anonId = req.get("authorization")?.split(" ")[1]
        const { blogId } = req.body
        const verifyAnon = getBlogSchema.safeParse({id : anonId}) 
        const verifyBlog = getBlogSchema.safeParse({id : blogId})
        if(!verifyAnon.success || !verifyBlog.success){
            throw new Error("invalid blogId or unauthorized")
        }
        req.body.anonId = anonId
    }catch(error){
        return res.status(400).json({
            success : false,
            message : "bad request",
            error : "invalid blogId or unauthorized"
        })
    }
    
    next()
}

export const validateContent = (req :Request, res :Response, next :NextFunction) => {
    const body = req.body
    if(!String(body.content) || body.content.length < 1) return res.status(400).json({
        success : false,
        message : "bad request",
        error : "you cannot post an empty content"
    })

    next()
}

export const validateGetComments = (req :Request, res :Response, next :NextFunction) => {
    try{
        const blogId = req.params.id
        const anonId = req.get("authorization")?.split(" ")[1]
        const verifyAnon = getBlogSchema.safeParse({id : anonId})
        const verifyBlogId = getBlogSchema.safeParse({id : blogId})

        if(!verifyAnon.success) throw new Error("unauthorized")
        if(!verifyBlogId.success) throw new Error("invalid blog selected")
        
        res.locals.blogId = blogId
        res.locals.anonId = anonId

        next()
    }catch(error :any){
        if(error.message === "unauthorized"){ 
            return res.status(401).json({
                success : false,
                message : error.message,
                error : "you are permited to perform this operation"
            })
        }else{
           return res.status(400).json({
                success : false,
                message : "bad request",
                error : error.message
            }) 
        }
    }
}

export const validateCreateReplies = (req :Request, res :Response, next :NextFunction) => {
    
    try{
        const anonId = req.get("authorization")?.split(" ")[1]
        const { commentId, content, username } = req.body
        const verifyAnon = getBlogSchema.safeParse({id : anonId})
        const verifyBlogId = getBlogSchema.safeParse({id : commentId})

        if(!verifyAnon.success) throw new Error("unauthorized")
        if(!verifyBlogId.success) throw new Error("invalid comment selected")

        if(!String(content)) throw new Error("invalid comment selected")
        res.locals.commentId = commentId
        res.locals.anonId = anonId
        res.locals.content = content
        if(req.body.username){
            res.locals.username = username
        }else{
            res.locals.username = undefined
        }
        next()
    }catch(error :any){
        if(error.message === "unauthorized"){
            return res.status(401).json({
                success : false,
                message : error.message,
                error : "you are not permitted to perform this action"
            })
        }else{
            return res.status(400).json({
                success : false,
                message : "bad request",
                error : error.message
            })
        }
    }
}

export const validateGetReplies = (req :Request, res :Response, next :NextFunction) => {
    try{
        const anonId = req.get("authorization")?.split(" ")[1]
        const commentId = req.params.id
        const verifyAnon = getBlogSchema.safeParse({id : anonId})
        const verifyCommentId = getBlogSchema.safeParse({id : commentId})

        if(!verifyAnon.success) throw new Error("unauthorized")
        if(!verifyCommentId.success) throw new Error("invalid comment selected")
        
        res.locals.anonId = anonId
        res.locals.commentId = commentId

        next()
    }catch(error :any){
        if(error.message === "unauthorized"){
            return res.status(401).json({
                success : false,
                message : error.message,
                error : "you are not permitted to perform this action"
            })
        }else{
            return res.status(400).json({
                success : false,
                message : "bad request",
                error : error.message
            })
        }
    }
}