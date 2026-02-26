import { Request, Response } from "express"
import { ReviewService } from "../services/review.service"

interface AuthRequest extends Request {
  userId?: string
}

const reviewService = new ReviewService()

export class ReviewController {
  async create(req: AuthRequest, res: Response) {
    try {
      const { rating, comment, bookId } = req.body
      const userId = req.userId!

      const review = await reviewService.createReview(
        userId,
        bookId,
        rating,
        comment
      )

      res.status(201).json(review)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }
}