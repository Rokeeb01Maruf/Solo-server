import { 
    getBlogsRepo,
    unLikeBlogRepo,
    likeBlogRepo
 } from "../repositories/blogs.repo"

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