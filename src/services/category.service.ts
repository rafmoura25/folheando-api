import { prisma } from "../prisma"

export class CategoryService {
  async getAll() {
    return prisma.category.findMany()
  }
}