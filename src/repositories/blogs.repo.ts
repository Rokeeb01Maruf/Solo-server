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

export const likeBlogRepo = async(blogId :string, anonId :string) => {
    const blogs =  await prisma.likes.create({
        data : {
            blogId : blogId,
            likerId : anonId
        },
        select : {
            blog : true
        }
    })
    return await prisma.blogs.findFirst({
        where : {
            id : blogs.blog.id
        },
        include : {
            _count : {
                select : {
                    likes : true
                }
            }
        }
    })
}

export const unLikeBlogRepo = async(id :string, anonId :string) => {
    const blogs =  await prisma.likes.delete({
        where : {
            blogId_likerId : {
                blogId : id,
            likerId : anonId
            }
        },
        select : {
            blog : true,
        },
    })

    return await prisma.blogs.findFirst({
        where : {
            id : blogs.blog.id
        },
        include : {
            _count : {
                select : {
                    likes : true
                }
            }
        }
    })
}