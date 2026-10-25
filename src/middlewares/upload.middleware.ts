import multer from "multer"

export const parser = (count: number) => {
    return multer({
        storage: multer.memoryStorage(),
        limits: {
            fileSize: 5 * 1024 * 1024,
            files: count
        },
        fileFilter: (req, file, cb) => {
            const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

            if (!allowedTypes.includes(file.mimetype)) {
                cb(new Error("Only JPEG, PNG, and WebP images are allowed"))
            } else {
                cb(null, true)
            }
        }
    })
}
export const profileParser = parser(1)

export const blogParser = parser(2)