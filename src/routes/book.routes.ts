import { Router } from "express"
import { BookController } from "../controllers/book.controller"

const router = Router()
const bookController = new BookController()

router.get("/", bookController.getAll)
router.get("/top-rated", (req, res) =>
  bookController.getTopRated(req, res)
)
router.get("/:id", bookController.getById)

export default router