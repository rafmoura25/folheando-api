import { prisma } from "../prisma"
import bcrypt from "bcryptjs"
import { generateToken } from "../utils/jwt"

export async function register(name: string, email: string, password: string) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    throw new Error("Usuário já existe")
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
  })

  const token = generateToken(user.id)

  return { user, token }
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    throw new Error("Usuário não encontrado")
  }

  const valid = await bcrypt.compare(password, user.passwordHash)

  if (!valid) {
    throw new Error("Senha inválida")
  }

  const token = generateToken(user.id)

  return { user, token }
}