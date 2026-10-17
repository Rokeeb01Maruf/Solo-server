import Router from "express"
import { ValidateSignup, 
    ValidateSignin, 
    validateRefreshToken,
    validateUser,
    validateChangePassword
 } from "../middlewares/auth.middleware"
import { signupController, 
    signinController, 
    refreshTokenController,
    verifyEmail,
    resendOtpController,
    passwordResetOtp,
    validatePasswordOtp,
    passwordResetController,
    changePasswordController
 } from "../controllers/auth.controller"
const router = Router()

router.post("/signup", ValidateSignup, signupController)
router.post("/signin", ValidateSignin, signinController)
router.post("/refresh", validateRefreshToken, refreshTokenController)
router.patch("/email", verifyEmail)
router.patch("/otp", resendOtpController)
router.post("/password/request", passwordResetOtp)
router.post("/password/reset", passwordResetController)
router.post("/password/change", validateUser, validateChangePassword, changePasswordController)
router.post("/otp", validatePasswordOtp)

export default router