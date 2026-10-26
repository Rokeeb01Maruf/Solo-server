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