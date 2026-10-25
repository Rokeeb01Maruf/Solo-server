import { prisma } from "../../lib/prisma"
import { blogPostType } from "../../utils/types";
export const getUserRepo = async(id :string) => {
    const user = await prisma.users.findUnique({
        where : {
            id : id
        },
        omit : {
            password : true
        }
    })

    if (user){
        return { user : user }
    }else{
        return { error : "user not found" }
    }
}

export const blogPostRepo = async (userId :string, data :blogPostType)=>{
    return await prisma.blogs.create({
        data : {
            title : data.title,
            slug : data.slug,
            content: data.content,
            userId : userId,
            coverImageUrl : data.coverImageUrl
        }
    })
}