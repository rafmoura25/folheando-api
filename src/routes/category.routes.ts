import { Router } from "express"
import { CategoryController } from "../controllers/category.controller"

const router = Router()
const controller = new CategoryController()

router.get("/", (req, res) => controller.getAll(req, res))

export default router