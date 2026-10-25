import { getUserRepo, blogPostRepo } from "../repositories/users.repo"
import { blogPostType } from "../../utils/types"
import crypto from "crypto"

export const getUserService = async (id :string) => {
    return await getUserRepo(id)
}

export const createBlogService = async (userId :string, data :blogPostType) => {
const slug = `${data.title.split(" ").join("-")}-${crypto.randomUUID().substring(0, 5)}`
    data.slug = slug
    const blog = await blogPostRepo(userId, data)
    return blog
}