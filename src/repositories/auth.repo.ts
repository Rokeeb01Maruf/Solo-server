import { prisma } from "../../lib/prisma"
import { signup } from "../../utils/types"
import { Prisma } from "../../generated/prisma/client"
import { codec } from "zod";

export const retrieveUser = async (email: string) => {
    const user = await prisma.users.findUnique({
        where: {
            email: email
        }
    })

    if (user) {
        return { user: user }
    } else {
        return { error: "user not found" }
    }
}

export const recordUser = async (data: signup, code :string) => {
    try{
        const storeUser = await prisma.users.create({
            data: {
                email: data.email,
                password: data.password,
                username: data.username,
                profileUrl: data.profileUrl,
                location: data.location,
                lastDevice: data.lastDevice,
                otp : {
                    create : {
                        code : code,
                        expiresAt : new Date(Date.now() + 60 * 1000),
                        passwordType : "email"
                    }
                }
            }
        })
        return {userId : storeUser.id}
    }catch(error){
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002"){
                return {error : "user already exists"}
            }
        }
        return {error : "internal server error"}
    }
}

export const storeRefreshToken = async (userId: string, refresh: string, pRefresh: string) => {
    try{
        const token = await prisma.refresh_token.create({
            data : {
                userId : userId,
                token : refresh
            },
        })
        return token.token
    }catch(error){
        if (error instanceof Prisma.PrismaClientKnownRequestError){
            if (error.code === "P2002") {
                try{
                    const token = await prisma.refresh_token.update({
                        where : {
                            userId : userId,
                            token : pRefresh
                        },
                        data : {
                            token : refresh
                        }
                    })
            
                    return token.token
                }catch(err){
                    if (err instanceof Prisma.PrismaClientKnownRequestError){
                        if(err.code === "P2025"){
                            throw new Error("invalid or expired token")
                        }else{
                            throw new Error("internal server error")
                        }
                    }else{
                        throw new Error("internal server error")
                    }
                    
                }
            }else{
                throw new Error("internal server error")
            }
        }
    }
}

export const createRefreshToken = async(userId: string, refresh: string) => {
    const token = await prisma.refresh_token.upsert({
        where : {
            userId : userId
        },

        update : {
            token : refresh
        },

        create : {
            userId : userId,
            token : refresh
        }
    })
    return token.token
}

export const storeOtp = async(id :string, otp :string) => {
    const result = await prisma.otp.create({
        data : {
            userId : id,
            code : otp,
            passwordType : "email",
            expiresAt : new Date(Date.now() + 60 * 1000)
        }
    })
    return result.code
}


export const getOtp = async (userId :string, type :string) => {
    if(type === "email"){
        const code = await prisma.otp.findFirst({
            where : {
                userId : userId,
                passwordType : type,
                isUsed : false
            },

            select : {
                id : true,
                userId : true,
                code : true,
                expiresAt : true,
                isUsed : true
            }
        })
        return code
    }
}

export const validateEmail = async (userId :string, id :string) => {
    const user = await prisma.$transaction([
        prisma.users.update({
            where : {
                id : userId
            },
            data : {
                emailVerified : true
            } 
        }),
        prisma.otp.update({
            where : {
                id : id
            },
            data : {
                isUsed : true
            }
        })
    ])
    return user
}