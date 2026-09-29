import { UserType } from "./types"

export const User = (data :UserType) => {
    const user = {
        id: data.id,
        username: data.username,
        email: data.email,
        profileUrl : data.profileUrl,
        authProvider : data.authProvider,
    }
    return user
}