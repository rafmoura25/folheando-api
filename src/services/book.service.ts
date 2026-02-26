import { prisma } from "../prisma"

export class BookService {
  async getAllBooks() {
    const books = await prisma.book.findMany({
      include: {
        reviews: true,
        category: true,
      },
    })

    return books.map((book) => {
      const average =
        book.reviews.reduce((acc, r) => acc + r.rating, 0) /
        (book.reviews.length || 1)

      return {
        id: book.id,
        title: book.title,
        author: book.author,
        description: book.description,
        price: book.price,
        imageUrl: book.imageUrl ?? null,
        category: book.category.name,
        categoryId: book.categoryId,
        averageRating: Number(average.toFixed(1)),
        totalReviews: book.reviews.length,
      }
    })
  }

  async getBookById(id: string) {
    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        category: true,
      },
    })

    if (!book) return null

    const average =
      book.reviews.reduce((acc, r) => acc + r.rating, 0) /
      (book.reviews.length || 1)

    return {
      id: book.id,
      title: book.title,
      author: book.author,
      description: book.description,
      price: book.price,
      imageUrl: book.imageUrl ?? null,
      category: book.category.name,
      categoryId: book.categoryId,
      averageRating: Number(average.toFixed(1)),
      totalReviews: book.reviews.length,
      reviews: book.reviews,
    }
  }

  async getTopRated(limit = 5) {
    const books = await prisma.book.findMany({
      include: {
        reviews: true,
        category: true
      }
    })

    const formatted = books.map((book) => {
      const average =
        book.reviews.reduce((acc, r) => acc + r.rating, 0) /
        (book.reviews.length || 1)

      return {
        id: book.id,
        title: book.title,
        author: book.author,
        price: book.price,
        imageUrl: book.imageUrl ?? null,
        category: book.category.name,
        categoryId: book.categoryId,
        averageRating: Number(average.toFixed(1)),
        totalReviews: book.reviews.length
      }
    })

    return formatted
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, limit)
  }
}