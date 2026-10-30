import { UploadApiResponse } from "cloudinary"
import cloudinary from "../../utils/cloudinary.js"

export const uploadImageService = (folder :string, buffer :Buffer): Promise<UploadApiResponse> => {
    return new Promise((resolve, reject)=>{
        cloudinary.uploader.upload_stream({
            folder : folder,
            resource_type : "image"
        },
        (error, result) => {
            if(error) return reject(error)
            if(!result) return reject(new Error("cloudinary returns no uploaded result"))

            resolve(result)
        }
        ).end(buffer)
    })
}