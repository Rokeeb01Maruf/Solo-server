import type { signup, signin } from "../../utils/types"
import { recordUser, retrieveUser } from "../repositories/auth.repo"
import { hashPassword, verifyPassword } from "../../utils/argon"
import { generateToken } from "../../lib/jwt"

export const createUser = async (data : signup) => {
    const hash = await hashPassword(data.password)
    data.password = hash
    const user = await recordUser(data)
    if (user.error){
        throw new Error(user.error)
    }else if(user.userId){
        const tokens = generateToken(user.userId)
        return {
            id : user.userId,
            tokens
        }
    }
}

export const getUser = async (data :signin) => {
    const user = await retrieveUser(data.email)
    if(user.error){
        throw new Error(user.error)
    }else if(user.user){
        const isValid = await verifyPassword(data.password, user.user.password)
        if(isValid){
            const tokens = generateToken(user.user.id)
            return {
                id : user.user.id,
                tokens
            }
        }else{
            throw new Error("password mismatch")
        }
    }
}