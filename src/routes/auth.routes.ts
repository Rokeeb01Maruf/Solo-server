import Router from "express"
import { ValidateSignup, ValidateSignin } from "../middlewares/auth"
import { signup, signin } from "../controllers/auth.controller"
const router = Router()

router.post("/signup", ValidateSignup, signup)
router.post("/signin", ValidateSignin, signin)

export default router