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

        take : limit
    })
}