import { prisma } from "../../lib/prisma"
import { signup } from "../../utils/types"
import { Prisma } from "../../generated/prisma/client"

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
                        expiresAt : new Date(Date.now() + 5 * 60 * 1000),
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
            expiresAt : new Date(Date.now() + 5 * 60 * 1000)
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

export const changeOtpRepo = async(userId :string, type :string, code :string) => {
    if (type === "email"){
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000)
        const findOtp = await prisma.otp.findFirst({
            where : {
                userId : userId,
                passwordType : "email",
                isUsed : false
            }
        })

        if (!findOtp || !findOtp.id) throw new Error("user cannot generate email otp")
        const otp = await prisma.otp.update({
            where : {
                id : findOtp.id
            },

            data : {
                code : code,
                isUsed : false,
                expiresAt : expiresAt
            },

            include : {
                user : {
                    select : {
                        email : true
                    }
                }
            }
        })

        return otp
    }
}

export const getUser = async (email :string) => {
    const user = await prisma.users.findFirst({
        where : {
            email : email
        }
    })
    return user
}

export const upsertPasswordOtp = async(otp :string, userId :string) => {
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000)
    const upsert = await prisma.otp.upsert({
        where : {
            userId_passwordType : {
                userId : userId,
                passwordType : "password"
            }
        },

        update : {
            code : otp,
            isUsed : false,
            expiresAt : expiresAt
        },

        create : {
            userId : userId,
            code : otp,
            passwordType : "password",
            expiresAt : expiresAt
        },

        include : {
            user : {
                select : {
                    email : true
                }
            }
        }
    })
    return upsert
}

export const storePasswordResetToken = async (userId :string, token :string) => {
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000)
    const code = await prisma.token.upsert({
        where : {
            userId : userId
        },

        update : {
            token : token,
            expiresAt : expiresAt,
            isUsed : false
        },

        create : {
            userId : userId,
            token : token,
            expiresAt : expiresAt
        }
    })
    return code
}

export const getPasswordOtp = async (userId :string) => {
    const otp = await prisma.otp.findFirst({
        where : {
            userId : userId,
            passwordType : "password",
        }
    })

    if (!otp) throw new Error("token cannot be found")
    
    return otp
}

export const getPasswordResetToken = async(userId :string) => {
    const storedToken = await prisma.token.findFirst({
        where : {
            userId : userId
        }
    })

    return storedToken
}

export const resetUserPassword = async(userId :string, password :string) => {
    return await prisma.users.update({
        where : {
            id : userId,
            emailVerified : true
        },

        data : {
            password : password
        }
    })
}

export const retrieveUserbyId = async(id :string) => {
    return await prisma.users.findFirst({
        where : {
            id : id
        }
    })
}