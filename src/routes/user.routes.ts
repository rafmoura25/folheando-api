import { Router } from "express"
import { UserController } from "../controllers/user.controller"

const router = Router()
const controller = new UserController()

router.get("/top-reviewers", (req, res) =>
  controller.getTop(req, res)
)

export default router