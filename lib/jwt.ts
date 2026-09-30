import jwt from "jsonwebtoken"
import "dotenv"

export const generateToken = (id :string) => {
    const accessToken = jwt.sign(
        {userId : id},
        process.env.ACCESS_TOKEN_SECRET!,
        {expiresIn: "15m"}
    )

    const refreshToken = jwt.sign(
        {userId : id},
        process.env.REFRESH_TOKEN_SECRET!,
        {expiresIn: "3d"}
    )

    return {
        tokens : {
            access : accessToken,
            refresh : refreshToken
        }
    }
}

export const verifyAccessToken = (token :string) => {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!)
}

export const verifyRefreshToken = (token :string) => {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!)
}