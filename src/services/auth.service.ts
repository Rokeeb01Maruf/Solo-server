import type { signup, signin } from "../../utils/types"
import crypto from "crypto"
import {
    recordUser,
    retrieveUser,
    storeRefreshToken,
    createRefreshToken,
    getOtp,
    validateEmail,
    changeOtpRepo,
    getUser,
    upsertPasswordOtp,
    getPasswordOtp,
    storePasswordResetToken,
    getPasswordResetToken,
    resetUserPassword,
    retrieveUserbyId
} from "../repositories/auth.repo"
import { hashPassword, verifyPassword } from "../../utils/argon"
import { generateToken } from "../../lib/jwt"

export const createUserService = async (data: signup) => {
    const hash = await hashPassword(data.password)
    const otp = crypto.randomInt(100000, 1000000).toString()
    const hashedOtp = await hashPassword(otp)
    data.password = hash
    const user = await recordUser(data, hashedOtp)
    if (user.error) {
        throw new Error(user.error)
    }
    return { userId : user.userId, otp: otp }
}

export const getUserService = async (data: signin) => {
    const user = await retrieveUser(data.email)
    if (user.error) {
        throw new Error(user.error)
    } else if (user.user) {
        const isValid = await verifyPassword(data.password, user.user.password)
        if (isValid) {
            const { tokens } = generateToken(user.user.id)
            const refreshToken = await createRefreshToken(user.user.id, tokens.refresh)
            if (refreshToken) {
                return {
                    id: user.user.id,
                    tokens
                }
            } else {
                throw new Error("internal server error")
            }
        } else {
            throw new Error("password mismatch")
        }
    }
}

export const refreshTokenService = async (id: string, pRefresh: string) => {
    const { tokens } = generateToken(id)
    const refreshToken = await storeRefreshToken(id, tokens.refresh, pRefresh)
    if (refreshToken) {
        return {
            id: id,
            tokens
        }
    } else {
        throw new Error("internal server error")
    }
}

export const validateOtp = async(otp :string, userId :string, type :string) => {
    const code = await getOtp(userId, type)
    const now = new Date()
    if(code){
        if (code.isUsed) throw new Error("used token")
        if (now > code.expiresAt) throw new Error("expired token")
        const validatedOtp = await verifyPassword(otp, code.code)
        if(!validatedOtp) throw new Error("invalid token")
        const email = validateEmail(code.userId, code.id)
        if (!email) throw new Error("internal server error")
            return email
    }else{
        throw new Error("invalid or expired otp")
    }
}

export const resendOtpService = async(userId :string, type :string) => {
    const code = crypto.randomInt(100000, 1000000).toString()
    const hashedOtp = await hashPassword(code)
    const otp = await changeOtpRepo(userId, type, hashedOtp)
    return {otp : otp, code : code}
}

export const sendPasswordOtp = async(email :string) => {
    const user = await getUser(email)
    if(!user) throw new Error("user not found")
    const code = crypto.randomInt(100000, 1000000).toString()
    const hashedOtp = await hashPassword(code)
    const otp = await upsertPasswordOtp(hashedOtp, user.id)

    if (!otp) throw new Error("failed to generate otp")
    return {otp : code, userId : user.id}
}

export const getOtpService = async(userId :string) => {
    const otp = await getPasswordOtp(userId)
    if ( new Date() > otp.expiresAt ) throw new Error("expired otp")
    if (otp.isUsed) throw new Error("invalid otp")
    return otp.code
}

export const storeTokenService = async(code :string, userId :string) => {
    return await storePasswordResetToken(userId, code)
}

export const passwordResetService = async(userId :string, token :string, password :string) => {
    const storedToken = await getPasswordResetToken(userId)
    if(!storedToken) throw new Error("internal server error")
    if (storedToken.token != token) throw new Error("invalid token")
    if (new Date() > storedToken.expiresAt) throw new Error("expired token")
    
    return await resetUserPassword(userId, await hashPassword(password))
}

export const changePasswordservice = async (userId :string, password :string) => {
    return await resetUserPassword(userId, await hashPassword(password))
}

export const retrieveUserService = async(id :string) => {
    return await retrieveUserbyId(id)
}