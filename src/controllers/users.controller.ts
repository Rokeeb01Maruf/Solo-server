import { Request, Response} from "express"
import { getUserService } from "../services/users.service"
import { success } from "zod";

export const getMeController = async (req: Request, res: Response) => {
    const userId = (req as any).user.userId
    try{
        const user = await getUserService(userId)
        if (user.user){
            return res.status(200).json({
                success : true,
                message : "user retrieved successfully",
                data : {
                    user : user.user
                }
            })
        }else if (user.error){
            return res.status(404).json({
                success : false,
                message : "user not found",
                error : user.error
            })
        }
    }catch(error){
        return res.send(500).json({
            success : false,
            message : "internal server error",
            error : "server failed to retrieve user data"
        })
    }
}