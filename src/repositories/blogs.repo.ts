import { prisma } from "../../lib/prisma"

export const getBlogsRepo = async(offset :number, limit :number) => {
    return await prisma.blogs.findMany({
        where : {
            status : "published"
        },

        orderBy : {
            createdAt : "desc"
        },
        skip : offset,

        take : limit,

        include : {
            likes : true,
            _count : {
                select : {
                    likes : true
                }
            }
        },

        
        
    })
}

export const likeBlogRepo = async(blogId :string, likerId :string) => {
    return await prisma.likes.create({
        data : {
            blogId : blogId,
            likerId : likerId
        },
        select : {
            blog : true
        }
    })
}

export const unlikeBlogRepo = async(id :string, likerId :string) => {
    return await prisma.likes.delete({
        where : {
            id : id,
            likerId : likerId
        },
        select : {
            blog : true
        }
    })
}