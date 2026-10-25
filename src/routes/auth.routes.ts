import Router from "express"
import { 
    ValidateSignup, 
    ValidateSignin, 
    validateRefreshToken,
    validateUser,
    validateChangePassword
 } 
from "../middlewares/auth.middleware"
import { 
    signupController, 
    signinController, 
    refreshTokenController,
    verifyEmail,
    resendOtpController,
    passwordResetOtp,
    validatePasswordOtp,
    passwordResetController,
    changePasswordController,
 } 
from "../controllers/auth.controller"
import { 
    resendOtpRateLimiter,
    changePasswordRateLimiter,
    resetPasswordRateLimiter,
    signinRateLimiter,
    signupRateLimiter,
    refreshTokenRateLimiter
} 
 from "../middlewares/rateLimit.middleware"
import { profileParser } from "../middlewares/upload.middleware"

const router = Router()

router.post("/signup", signupRateLimiter, profileParser.single("avatar"),ValidateSignup, signupController)
router.post("/signin", signinRateLimiter,ValidateSignin, signinController)
router.post("/refresh", refreshTokenRateLimiter,validateRefreshToken, refreshTokenController)
router.patch("/email", resetPasswordRateLimiter, verifyEmail)
router.patch("/otp", resendOtpRateLimiter, resendOtpController)
router.post("/password/request", resetPasswordRateLimiter, passwordResetOtp)
router.post("/password/reset", resetPasswordRateLimiter, passwordResetController)
router.post("/password/change", changePasswordRateLimiter,validateUser, validateChangePassword, changePasswordController)
router.post("/otp", resetPasswordRateLimiter, validatePasswordOtp)
export default router