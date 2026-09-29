import { getUserRepo } from "../repositories/users.repo"

export const getUserService = async (id :string) => {
    return await getUserRepo(id)
}