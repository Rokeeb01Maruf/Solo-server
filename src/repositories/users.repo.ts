import { prisma } from "../../lib/prisma"
export const getUserRepo = async(id :string) => {
    const user = await prisma.users.findUnique({
        where : {
            id : id
        },
        omit : {
            password : true,
            location : true,
            lastDevice : true
        }
    })

    if (user){
        return { user : user }
    }else{
        return { error : "user not found" }
    }
}