import jwt from "jsonwebtoken"
import "dotenv"

export const generateToken = (id :string) => {
    const accessToken = jwt.sign(
        {sub : id},
        process.env.ACCESS_TOKEN_SECRET!,
        {expiresIn: "15m"}
    )

    const refreshToken = jwt.sign(
        {sub : id},
        process.env.REFRESH_TOKEN_SECRET!,
        {expiresIn: "3d"}
    )

    return {
        token : {
            access : accessToken,
            refresh : refreshToken
        }
    }
}