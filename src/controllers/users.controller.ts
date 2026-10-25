import { Request, Response} from "express"
import logger from '../../utils/logger'
import { 
    getUserService,
    createBlogService,
} from "../services/users.service"
import { uploadImageService } from "../services/upload.service"

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

export const createBlogController = async (req :Request, res :Response) => {
    try{
        const files = req.files as {
          [fieldname: string]: Express.Multer.File[];
        };
        
        const body = req.body

        const user = (req as any).user.userId

        let imageError :string;

        if(files?.cover?.[0]?.buffer && files?.inline?.[0]?.buffer){
            const [ coverResult, inlineResult ] = await Promise.allSettled([
            uploadImageService("solo/cover", files?.cover?.[0].buffer),
            uploadImageService("solo/inline", files?.inline?.[0].buffer)
            ])
            if(coverResult.status === "rejected" || inlineResult.status === "rejected"){
                imageError = "rejected"
                logger.warn({err : "upload failed"}, "cover or inline image failed")
            }else{
                body.coverImageUrl = coverResult.value.secure_url
                body.content = body.content.replace("(solo-inline-image)", `(${inlineResult.value.secure_url})`)
            }
        }else if(files?.cover?.[0].buffer){
            try{
                const coverResult = await uploadImageService("solo/cover", files?.cover?.[0].buffer)
                body.coverImageUrl = coverResult.secure_url
            }catch(err){
                logger.warn({err : err}, "cover image failed to upload")
                imageError = "rejected"
            }
            
        }else if(files?.inline?.[0].buffer){
            try{
                const inlineResult = await uploadImageService("solo/inline", files?.inline?.[0].buffer)
                body.content = body.content.replace("(solo-inline-image)", `(${inlineResult.secure_url})`)
            }catch(err){
                logger.warn({err : err}, "inline image failed to upload")
                imageError = "rejected"
            }
            
        }

        const blog = await createBlogService(user, body)
        logger.info({userId : user}, "blog posted successfully")
        return res.status(201).json({
            success : true,
            message : ()=>{
                if(imageError === "rejected") return "blog posted successfully but encountered problem when uploading the image"
                return "blog posted successfully"
            },
            data : {
                id : blog.id
            }
        })
    }catch(error :any){
        logger.error({err : error}, "failed to post the blog")
        return res.status(500).json({
            success : false,
            message : "internal server error",
            error : error
        })
    }
}