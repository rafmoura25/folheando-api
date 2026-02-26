import { Router } from "express"
import { authMiddleware } from "../middlewares/auth.middleware"
import { ReviewController } from "../controllers/review.controller"

const router = Router()
const reviewController = new ReviewController()

router.post(
  "/",
  authMiddleware,
  (req, res) => reviewController.create(req, res)
)

export default router