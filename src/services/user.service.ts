import { prisma } from "../prisma"

export class UserService {
  async getTopReviewers() {
    const users = await prisma.user.findMany({
      include: {
        reviews: true,
      },
    })

    return users
      .map((user) => ({
        id: user.id,
        name: user.name,
        totalReviews: user.reviews.length,
      }))
      .sort((a, b) => b.totalReviews - a.totalReviews)
      .slice(0, 3)
  }
}