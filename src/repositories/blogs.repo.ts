import { prisma } from "../../lib/prisma.js"

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
                    likes : true,
                    comments : true
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
                    likes : true,
                    comments : true
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
                    likes : true,
                    comments : true
                }
            }
        }
    })
}

export const getBlogDetailsRepo = async(blogId :string) => {
    return await prisma.blogs.findFirst({
        where : {
            id : blogId
        },
        include : {
            _count : {
                select : {
                    likes : true,
                    comments : true,
                }
            },
            comments : {
                include : {
                    _count : {
                        select : {
                            replies : true
                        }
                    }
                },
                orderBy : {
                    createdAt : "desc"
                }
            }
        }
    })
}

export const createCommentRepo = async(data :{anonId :string, blogId :string, content :string, username :string | undefined}) => {
    const comment =  await prisma.comments.create({
        data : data,
        select : {
            blogId : true
        }
    })

    return await getBlogDetailsRepo(comment.blogId)
}

export const getRepliesRepo = async(commentId :string) => {
    return await prisma.comments.findMany({
        where : {
            id :commentId
        },
        include : {
            replies : true,
            _count : {
                select : {
                    replies : true
                }
            }
        }
    })
}

// export const getRepliesRepo = async(data :{anonId :string, commentId :string}) => {
//     return await prisma.comments.findMany({
//         where : data,
//         include : {
//             _count : {
//                 select : {
//                     replies : true
//                 }
//             },
//             replies : {
//                 orderBy : {
//                     createdAt : "desc"
//                 }
//             }
            
//         }
//     })
// }


export const createReplyRepo = async(data : {commentId : string, anonId :string, content :string, username : string | undefined}) => {
    const reply = await prisma.replies.create({
        data : data,
        select : {
            comment : {
                select : {
                    id : true
                }
            }
        }
    })
    return await getRepliesRepo(reply.comment.id)
}