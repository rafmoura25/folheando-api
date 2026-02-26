import { Request, Response } from "express"
import { CategoryService } from "../services/category.service"

const service = new CategoryService()

export class CategoryController {
  async getAll(req: Request, res: Response) {
    const categories = await service.getAll()
    res.json(categories)
  }
}