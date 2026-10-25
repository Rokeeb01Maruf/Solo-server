import { getBlogsRepo } from "../repositories/blogs.repo"

export const getBlogsService = async({ page, limit }:{page : number, limit : number}) => {
    const offset = (page - 1) * limit
    return await getBlogsRepo(offset, limit)
}