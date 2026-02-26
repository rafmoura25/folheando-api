import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const category = await prisma.category.upsert({
    where: { name: "Ficção" },
    update: {},
    create: {
      name: "Ficção",
    },
  })

  await prisma.book.upsert({
    where: { title: "O Hobbit" },
    update: {},
    create: {
      title: "O Hobbit",
      author: "J.R.R. Tolkien",
      description: "Uma aventura épica.",
      price: "49.90",
      categoryId: category.id,
    },
  })

  await prisma.book.upsert({
    where: { title: "1984" },
    update: {},
    create: {
      title: "1984",
      author: "George Orwell",
      description: "Distopia clássica.",
      price: "39.90",
      categoryId: category.id,
    },
  })

  console.log("Seed executado com segurança 🚀")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())