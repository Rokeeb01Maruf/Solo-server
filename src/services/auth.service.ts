import type { signup, signin } from "../../utils/types"
import crypto from "crypto"
import {
    recordUser,
    retrieveUser,
    storeRefreshToken,
    createRefreshToken,
    getOtp,
    validateEmail
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
    } else if (user.userId) {
        const { tokens } = generateToken(user.userId)
        const refreshToken = await storeRefreshToken(user.userId, tokens.refresh, "")
        if (tokens) return {
            id: user.userId,
            otp: otp,
            tokens
        }
    }
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
        if (now < code.expiresAt) throw new Error("expired token")
        const validatedOtp = await verifyPassword(otp, code.code)
        if(!validatedOtp) throw new Error("invalid token")
        const email = validateEmail(code.userId, code.id)
        if (!email) throw new Error("internal server error")
            return email
    }else{
        throw new Error("invalid or expired otp")
    }
}