import { Request, Response } from "express"
import crypto from "crypto"
import logger from "../../utils/logger"
import { 
    createUserService, 
    getUserService, 
    refreshTokenService, 
    validateOtp,
    resendOtpService,
    sendPasswordOtp,
    getOtpService,
    storeTokenService,
    passwordResetService,
    retrieveUserService,
    changePasswordservice
 } from "../services/auth.service"
import { uploadImageService } from "../services/upload.service"
import { sendPasswordResetEmail, sendRegistrationEmail } from "../../utils/email"
import { verifyPassword } from "../../utils/argon";

export const signupController = async (req :Request, res :Response) => {
    try{
        const image = req.file?.buffer
        if(!image) throw new Error("image file is required")
        const upload = await uploadImageService("solo/avatar",image)
        const data = req.body
        data.profileUrl = upload.secure_url
        const body = await createUserService(data)
        if(body) await sendRegistrationEmail(req.body.email, body.otp)
        logger.info({userId : body?.userId}, "account created successfully")
        return res.status(201).json({
            success : true,
            message : "user account created successfully, check your email for email verification otp",
            data : {
                id : body?.userId,
            }
        })
    }catch(error :any){
        console.log(error)
        if(error.message == "user already exists"){
            logger.warn("Signup rejected: user already exists")
            return res.status(400).json({
                success : false,
                message : "bad request",
                error : error.message
            })
        }else if(error.message === "image file is required"){
            logger.warn("Signup rejected: no image was uploaded")
            return res.status(400).json({
                success : false,
                message : "bad request",
                error : error.message
            })
        }else{
            logger.error({err : error}, "Signup failed")
            return res.status(500).json({
                success : false,
                message : "server failed to register user",
                error : error.message
            })
        }
    }
}

export const signinController = async (req :Request, res: Response) => {
    try{
        const body = await getUserService(req.body)
        logger.info(
            {userId : body?.id},
            "user sgnin successfully"
        )
        if (!body?.email){
            logger.warn({userId : body?.id}, "Signup aborted: user is unverified")
            return res.status(400).json({
                success : false,
                message : "bad request",
                error : "user is unverified"
            })
        }
        return res.status(200).json({
            success: true,
            message: "user signin successfully",
            data : body
        })
    }catch(error :any){
        if(error.message === "user not found" || error.message === "password mismatch"){
            logger.warn({err : error}, error.message)
            return res.status(400).json({
                success : false,
                message : "bad request",
                error : "invalid email or password"
            })        
        }else{
            logger.error({err : error}, "Signin failed")
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
        logger.info("token refreshed successfully")
        return res.status(200).json({
            success : true,
            message : "token refreshed successfully",
            data : data
        })
    }catch(error :any){
        if(error.message === "invalid or expired token"){
            logger.warn({err : error}, `token refresh aborted: ${error.message}`)
            return res.status(400).json({
                success : false,
                message : "bad request",
                error : error.message
            })
        }
        logger.error({err : error}, error.message)
        return res.status(500).json({
            success : false,
            message : "internal server error",
            error : "server failed to refresh token"
        })
    }
}

export const verifyEmail = async(req :Request, res :Response) => {
    const { id, otp } = req.body
    const code = String(otp)
    try{
        const validate = await validateOtp(code, id, "email")
        if(validate[0].emailVerified){
            logger.info({userId : id}, "user email verified")
            return res.status(200).json({
                success : true,
                message : "email verified successfully",
                data : {}
            })
        }
    }catch(err :any){
        const errors = ["expired token", "used token", "invalid token"]
        if (errors.includes(err.message)){
            logger.warn({err : err}, `email verification aborted : ${err.message}`)
            return res.status(400).json({
                success : false,
                message : "bad request",
                error : "invalid or expired token"
            })
        }else{
            logger.error({err : err}, err.message)
            return res.status(500).json({
                success : false,
                message : "internal server error",
                error : "server failed to validate email"
            })
        }
    }
}

export const resendOtpController = async (req :Request, res :Response) => {
    const { id } = req.body
    try{
        const resendOtp = await resendOtpService(id, "email")
        if(resendOtp && resendOtp.otp){
            await sendRegistrationEmail(resendOtp.otp.user.email, resendOtp.code)
            logger.info({userId : id}, "otp resent successfully")
            return res.status(200).json({
                success : true,
                message : "otp resent successfully",
                data : {}
            })
        }else{
            logger.error({userId : id}, "failed to resend otp")
            return res.status(500).json({
                success : false,
                message : "internal server error",
                error : "server failed to resend otp"
            })
        }
    }catch(error :any){
        logger.warn({userId : id}, "user cannot request otp resend")
        if (error.message === "user cannot generate email otp"){
            return res.send(400).json({
                success : false,
                message : "bad request",
                error : "this user cannot request otp resend"
            })
        }
        logger.error({err : error}, error.message)
        return res.status(500).json({
                success : false,
                message : "internal server error",
                error : error.message
            })
    }
}

export const passwordResetOtp = async (req :Request, res :Response) => {
    const { email } = req.body
    try{
        const { otp, userId } = await sendPasswordOtp(email)
        sendPasswordResetEmail(email, otp)
        logger.info({userId : userId}, "password reset otp has been sent to email")
        return res.status(200).json({
            success : true,
            message : "password reset email has been sent if user with this email exist",
            data : {
                id : userId
            }
        })
    }catch(error :any){
        const errors = ["failed to generate otp", "user not found"]
        if (errors.includes(error.message)){
            logger.warn({err : error}, error.message)
            return res.status(200).json({
                success : true,
                message : "password reset email has been sent if user with this email exist",
                data : {}
            })
        }
        logger.error({err : error}, error.message)
        return res.status(500).json({
            success : false,
            message : "internal server error",
            error : error.message
        })
    }

}

export const validatePasswordOtp = async (req :Request, res :Response) => {
    const { id, otp } = req.body
    try{
        const hashedOtp = await getOtpService(id)
        const isValid = await verifyPassword(otp, hashedOtp)
        if (!isValid) throw new Error("invalid otp")
        const token = crypto.randomBytes(32).toString("base64url")
        const storeToken = await storeTokenService(token, id)
        logger.info({userId : id}, "user verified successfully")
        return res.status(200).json({
            success : true,
            message : "user successfully verified",
            data : {
                id : id,
                token : token
            }
        })
    }catch(error :any){
        logger.warn({err : error}, error.message)
        if (error.message === "invalid otp" || error.message === "expired otp") return res.status(400).json({
            success : false,
            message : "bad request",
            error : "invalid or expired otp"
        })
        logger.error({err : error}, error.message)
        return res.status(500).json({
            success : false,
            message : "internal server error",
            error : error.message
        })
    }
}

export const passwordResetController = async (req :Request, res :Response) => {
    const { id, token, password } = req.body
    try{
        await passwordResetService(id, token, password)
        logger.warn({userId : id}, "password reset successfully")
        return res.status(200).json({
            success : true,
            message : "password reset successfully",
            data : {}
        })
    }catch(error :any){
        if(error.message === "invalid token" || error.message === "expired token"){
            logger.warn({err : error}, `password reset aborted: ${error.message}`)
            return res.status(400).json({
                success : false,
                message : "bad request",
                error : "invalid or expired token"
            })
        }else{
            logger.error({err : error}, error.message)
            return res.status(500).json({
                success : false,
                message : "internal server error",
                error : "server failed to change users password"
            })
        }
    }
}

export const changePasswordController = async (req :Request, res :Response) => {
    const { password, newPassword } = req.body
    const { userId } = (req as any).user
    const user = await retrieveUserService(userId)

    if(!user){
        logger.warn({userId : userId}, "password changing aborted : unauthorized user")
        return res.status(401).json({
            success : false,
            message : "unauthorized",
            error : "user is unauthorized to perform this action"
        })
    }
        

    if(!(await verifyPassword(password, user.password))){
        logger.warn({userId : userId}, "password is incorrect")
        return res.status(400).json({
            success : false,
            message : "invalid credentials",
            error : "password is incorrect"
        })
    } 

    try{
        await changePasswordservice(userId, newPassword)
        logger.warn({userId : userId}, "password chnaged successfully")
        return res.status(200).json({
            success : true,
            message : "password changed successfully",
            data : {}
        })
    }catch(error :any){
        logger.warn({err : error}, error.message)
        if (error) return res.status(500).json({
            success : false,
            message : "internal server error",
            error : "server failed to change password"
        })
    }
}