import type { signup, signin } from "../../utils/types"
import { recordUser, retrieveUser, storeRefreshToken, createRefreshToken } from "../repositories/auth.repo"
import { hashPassword, verifyPassword } from "../../utils/argon"
import { generateToken } from "../../lib/jwt"

export const createUserService = async (data : signup) => {
    const hash = await hashPassword(data.password)
    data.password = hash
    const user = await recordUser(data)
    if (user.error){
        throw new Error(user.error)
    }else if(user.userId){
        const { tokens } = generateToken(user.userId)
        const refreshToken = await createRefreshToken(user.userId, tokens.refresh)
        if (!refreshToken) throw new Error("internal server error")
        return {
            id : user.userId,
            tokens
        }
    }
}

export const getUserService = async (data :signin) => {
    const user = await retrieveUser(data.email)
    if(user.error){
        throw new Error(user.error)
    }else if(user.user){
        const isValid = await verifyPassword(data.password, user.user.password)
        if(isValid){
            const { tokens } = generateToken(user.user.id)
            const refreshToken = await createRefreshToken(user.user.id, tokens.refresh)
            if (refreshToken){
                return {
                    id : user.user.id,
                    tokens
                }
            }else{
                throw new Error("internal server error")
            }
        }else{
            throw new Error("password mismatch")
        }
    }
}

export const refreshTokenService = async (id :string, pRefresh :string) => {
    const  { tokens } = generateToken(id)
    const refreshToken = await storeRefreshToken(id, tokens.refresh, pRefresh)
    if (refreshToken){
        return {
            id : id,
            tokens
        }
    }else{
        throw new Error("internal server error")
    }
}