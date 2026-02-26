import { Request, Response } from "express"
import { BookService } from "../services/book.service"

const bookService = new BookService()

export class BookController {
  async getAll(req: Request, res: Response) {
    try {
      const books = await bookService.getAllBooks()
      res.json(books)
    } catch {
      res.status(500).json({ error: "Erro ao buscar livros" })
    }
  }

  async getById(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params

      const book = await bookService.getBookById(id)

      if (!book) {
        return res.status(404).json({ error: "Livro não encontrado" })
      }

      res.json(book)
    } catch {
      res.status(500).json({ error: "Erro ao buscar livro" })
    }
  }

  async getTopRated(req: Request, res: Response) {
    const books = await bookService.getTopRated()
    res.json(books)
  }
}