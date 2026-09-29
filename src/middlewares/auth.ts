import { Request, Response, NextFunction } from "express"
import { signupSchema, signinSchema } from "../../utils/zod"
import { success } from "zod";

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