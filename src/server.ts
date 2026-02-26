import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import authRoutes from "./routes/auth.routes"
import reviewRoutes from "./routes/review.routes"
import bookRoutes from "./routes/book.routes"
import categoryRoutes from "./routes/category.routes"
import userRoutes from "./routes/user.routes"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.json({ message: "API Folheando funcionando 🚀" })
})

app.use("/auth", authRoutes)
app.use("/reviews", reviewRoutes)
app.use("/books", bookRoutes)
app.use("/categories", categoryRoutes)
app.use("/users", userRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})