import { Request, Response, NextFunction } from "express"
import { signupSchema, signinSchema } from "../../utils/zod"
import { verifyAccessToken, verifyRefreshToken } from "../../lib/jwt"


export const ValidateSignup = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const body = req.body
    const result = signupSchema.safeParse(body)
    if (result.error){
        return res.status(400).json({
            success: false,
            message: "bad requests",
            errors: result.error.issues
        })
    }

    next()
}

export const ValidateSignin = (
    req :Request,
    res :Response,
    next :NextFunction
) => {
    const result = signinSchema.safeParse(req.body)
    if (result.error) {
        return res.status(400).json({
            success: false,
            message: "bad request",
            errors: result.error.issues
        })
    }

    next()
}

export const validateUser = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers
    if (!authorization || !authorization.startsWith("Bearer ")){
        return res.status(401).json({
            success : false,
            message : "unauthorized",
            error : "you are not authorized to perform this action"
        })
    }
    const token = authorization.split(" ")[1]

    try{
        const payload = verifyAccessToken(token);
        (req as any).user = payload
        next()
    }catch(error){
        return res.status(401).json({
            success : false,
            message : "unauthorized",
            error : "invalid or expired token"
        })
    }


}

export const validateRefreshToken = (req: Request, res: Response, next: NextFunction) => {
    const body = req.body
    const refreshToken = body.refresh

    try{
        const payload = verifyRefreshToken(refreshToken);
        (req as any).user = payload
        next()
    }catch(error){
        return res.status(401).json({
            success : false,
            message : "unauthorized",
            error : "invalid or expired token"
        })
    }
}