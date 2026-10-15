import { Request, Response } from "express"
import { createUserService, getUserService, refreshTokenService, validateOtp } from "../services/auth.service"
import { sendRegistrationEmail } from "../../utils/email"
import { success } from "zod";

export const signupController = async (req :Request, res :Response) => {
    try{
        const body = await createUserService(req.body)
        if(body) await sendRegistrationEmail(req.body.email, body.otp)
        return res.status(201).json({
            success : true,
            message : "user account created successfully, check your email for email verification otp",
            data : {
                id : body?.id,
                tokens : body?.tokens
            }
        })
    }catch(error :any){
        if(error.message == "user already exists"){
            return res.status(400).json({
                success : false,
                message : "bad request",
                error : error.message
            })
        }else{
            return res.status(500).json({
                success : false,
                message : "server failed to register user",
                error : error
            })
        }
    }
}

export const signinController = async (req :Request, res: Response) => {
    try{
        const body = await getUserService(req.body)
        return res.status(200).json({
            success: true,
            message: "user signin successfully",
            data : body
        })
    }catch(error :any){
        if(error.message === "user not found" || error.message === "password mismatch"){
            return res.status(400).json({
                success : false,
                message : "bad request",
                error : "invalid email or password"
            })
        }else{
            return res.status(500).json({
                success : false,
                message : "internal server error",
                error : "server failed to signin user"
            })
        }
    }
}

export const refreshTokenController = async(req: Request, res: Response) => {
    const payload = (req as any).user
    const body = req.body
    const refresh = body.refresh

    try{
        const data = await refreshTokenService(payload.userId, refresh)
        return res.status(200).json({
            success : true,
            message : "token refreshed successfully",
            data : data
        })
    }catch(error :any){
        if(error.message === "invalid or expired token"){
            return res.status(400).json({
                success : false,
                message : "bad request",
                error : error.message
            })
        }
        return res.status(500).json({
            success : false,
            message : "internal server error",
            error : "server failed to refresh token"
        })
    }
}

export const verifyEmail = async(req :Request, res :Response) => {
    const userId = (req as any).user.userId
    const otp = req.body.otp
    const code = String(otp)
    try{
        const validate = await validateOtp(code, userId, "email")
        if(validate[0].emailVerified){
            return res.status(200).json({
                success : true,
                message : "email verified successfully",
                data : {}
            })
        }
    }catch(err :any){
        const errors = ["expired token", "used token", "invalid token"]
        if (errors.includes(err.message)){
            return res.status(400).json({
                success : false,
                message : "bad request",
                error : "invalid or expired token"
            })
        }else{
            console.log(err.message)
            return res.status(500).json({
                success : false,
                message : "internal server error",
                error : "server failed to validate email"
            })
        }
    }
}