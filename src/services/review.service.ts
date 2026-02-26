import { prisma } from "../prisma"

export class ReviewService {
  async createReview(
    userId: string,
    bookId: string,
    rating: number,
    comment: string
  ) {
    // 🔹 Verifica se livro existe
    const book = await prisma.book.findUnique({
      where: { id: bookId },
    })

    if (!book) {
      throw new Error("Livro não encontrado")
    }

    // 🔹 Verifica se usuário já avaliou
    const existingReview = await prisma.review.findUnique({
      where: {
        unique_user_book: {
          userId,
          bookId,
        },
      },
    })

    if (existingReview) {
      throw new Error("Você já avaliou este livro")
    }

    const review = await prisma.review.create({
      data: {
        userId,
        bookId,
        rating,
        comment,
      },
    })

    return review
  }
}