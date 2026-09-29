import Router from "express"
import { validateUser } from "../middlewares/auth.middleware"
import { getMeController } from "../controllers/users.controller"

const router = Router()

router.get("/me", validateUser, getMeController)

export default router