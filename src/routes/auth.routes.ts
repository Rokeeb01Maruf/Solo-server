import Router from "express"
import { ValidateSignup, ValidateSignin, validateRefreshToken } from "../middlewares/auth.middleware"
import { signupController, signinController, refreshTokenController } from "../controllers/auth.controller"
const router = Router()

router.post("/signup", ValidateSignup, signupController)
router.post("/signin", ValidateSignin, signinController)
router.post("/refresh", validateRefreshToken, refreshTokenController)

export default router