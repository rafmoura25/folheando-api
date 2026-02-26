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

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
  ]

app.use(
  cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (e.g. curl, mobile apps, server-to-server)
      if (!origin) return callback(null, true)
      if (allowedOrigins.includes(origin)) return callback(null, true)
      callback(new Error(`CORS bloqueado para origem: ${origin}`))
    },
    credentials: true,
  })
)
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