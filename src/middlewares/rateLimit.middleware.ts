import rateLimit from "express-rate-limit"

const defaultRateLimiting = (time :number, limit :number) => {
    return rateLimit({
    windowMs : time,
    limit : limit,
    standardHeaders : true,
    legacyHeaders : false,
    message : {
        success : false,
        message : "too many requests",
        error : "too many requests try again later"
    }
})
}

export const generalRateLimiter = defaultRateLimiting(15*60*1000, 100)
export const resendOtpRateLimiter = defaultRateLimiting(60*1000, 2)
export const signinRateLimiter = defaultRateLimiting(60*1000, 5)
export const changePasswordRateLimiter = defaultRateLimiting(15*60*1000, 3)
export const refreshTokenRateLimiter = defaultRateLimiting(15*60*1000, 2)
export const resetPasswordRateLimiter = defaultRateLimiting(15*60*1000, 5)
export const signupRateLimiter = defaultRateLimiting(60*60*1000, 5)
