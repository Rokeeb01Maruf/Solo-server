import * as z from "zod"

export const signupSchema = z.object({
    username: z.string().nonempty(),
    password: z.string().min(8),
    location: z.string().nonempty(),
    email: z.email(),
    profileUrl: z.string().nonempty(),
    lastDevice: z.string().nonempty()
})

export const signinSchema = z.object({
    email: z.email(),
    password: z.string().min(8)
})