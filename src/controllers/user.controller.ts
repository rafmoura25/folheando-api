import { Request, Response } from "express"
import { UserService } from "../services/user.service"

const service = new UserService()

export class UserController {
  async getTop(req: Request, res: Response) {
    const users = await service.getTopReviewers()
    res.json(users)
  }
}