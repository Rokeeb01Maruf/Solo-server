import Router from "express"
import { ValidateSignup, 
    ValidateSignin, 
    validateRefreshToken,
    validateUser
 } from "../middlewares/auth.middleware"
import { signupController, 
    signinController, 
    refreshTokenController,
    verifyEmail
 } from "../controllers/auth.controller"
const router = Router()

router.post("/signup", ValidateSignup, signupController)
router.post("/signin", ValidateSignin, signinController)
router.post("/refresh", validateRefreshToken, refreshTokenController)
router.patch("/email", validateUser, verifyEmail)

export default router