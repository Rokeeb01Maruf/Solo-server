import { 
    getBlogsRepo,
    unLikeBlogRepo,
    likeBlogRepo,
    createCommentRepo,
    getBlogDetailsRepo,
    createReplyRepo, 
    getRepliesRepo
 } from "../repositories/blogs.repo.js"

export const getBlogsService = async({ page, limit }:{page : number, limit : number}) => {
    const offset = (page - 1) * limit
    return await getBlogsRepo(offset, limit)
}

export const likeBlogService = async(blogId :string, anonId :string) => {
    return await likeBlogRepo(blogId, anonId)
}

export const unLikeBlogService = async(blogId :string, anonId :string) => {
    return await unLikeBlogRepo(blogId, anonId)
}

export const createCommentService = async(data : {anonId :string, blogId :string, content :string, username :string | undefined}) => {
    return await createCommentRepo(data)
}

export const getBlogCommentsService = async(blogId :string) => {
    return await getBlogDetailsRepo(blogId)
}

export const createReplyService = async(data : {anonId :string, commentId :string, content :string, username :string | undefined}) => {
    return await createReplyRepo(data)
}

export const getRepliesService = async(commentId :string) => {
    return await getRepliesRepo(commentId)
}