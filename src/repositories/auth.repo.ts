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

export const recordUser = async (data: signup) => {
    try{
        const storeUser = await prisma.users.create({
            data: data
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