import * as z from "zod"

export const signupSchema = z.object({
    username: z.string().nonempty(),
    password: z.string().min(8),
    email: z.email()
})

export const signinSchema = z.object({
    email: z.email(),
    password: z.string().min(8)
})

export const passwordResetSchema = z.object({
    token : z.string().nonempty(),
    password : z.string().min(8)
})

export const changePasswordSchema = z.object({
    password : z.string().min(8),
    newPassword : z.string().min(8)
})

export const blogPostSchema = z.object({
    title : z.string().min(1).max(50),
    content : z.string().min(1).max(266)
})