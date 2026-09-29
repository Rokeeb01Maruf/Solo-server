import { Request, Response } from "express"
import { createUser, getUser } from "../services/auth.service"

export const signup = async (req :Request, res :Response) => {
    try{
        const body = await createUser(req.body)
        return res.status(201).json({
            success : true,
            message : "user account created successfully",
            data : {
                id : body?.id,
                tokens : body?.tokens.token
            }
        })
    }catch(error :any){
        if(error.message == "user already exists"){
            return res.status(400).json({
                success : false,
                message : "bad request",
                error : error.message
            })
        }else{
            return res.status(500).json({
                success : false,
                message : "server failed to register user",
                error : error
            })
        }
    }
}

export const signin = async (req :Request, res: Response) => {
    try{
        const body = await getUser(req.body)
        return res.status(200).json({
            success: true,
            message: "user signin successfully",
            data : body
        })
    }catch(error :any){
        if(error.message === "user not found" || error.message === "password mismatch"){
            return res.status(400).json({
                success : false,
                message : "bad request",
                error : "invalid email or password"
            })
        }else{
            return res.status(500).json({
                success : false,
                message : "internal server error",
                error : "server failed to signin user"
            })
        }
    }
}