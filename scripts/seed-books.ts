import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { translate } from "@vitalets/google-translate-api"

const prisma = new PrismaClient()
const API_KEY = process.env.GOOGLE_BOOKS_API_KEY!

// ─── Popular books to search — mix of PT titles and international classics ────

const BOOK_SEARCHES = [
    // Nacionais clássicos
    "Dom Casmurro Machado de Assis",
    "O Cortiço Aluísio Azevedo",
    "Capitães da Areia Jorge Amado",
    "Vidas Secas Graciliano Ramos",
    "Grande Sertão Veredas Guimarães Rosa",
    "Macunaíma Mário de Andrade",
    "Gabriela Cravo e Canela",
    "A Moreninha Joaquim Macedo",
    "Iracema José de Alencar",
    "O Guarani José de Alencar",
    "Senhora José de Alencar",
    "Memórias Póstumas de Brás Cubas",
    "Quincas Borba Machado de Assis",
    "Esaú e Jacó Machado de Assis",
    "Angústia Graciliano Ramos",
    "Cangaceiro José Lins do Rego",
    "O Quinze Rachel de Queiroz",
    "Menino de Engenho José Lins Rego",
    "Sagarana Guimarães Rosa",
    "Laços de Família Clarice Lispector",

    // Nacionais contemporâneos
    "O Alquimista Paulo Coelho",
    "Brida Paulo Coelho",
    "Memórias de Emília Monteiro Lobato",
    "A Hora da Estrela Clarice Lispector",
    "Dois Irmãos Milton Hatoum",
    "Estação Carandiru Drauzio Varella",

    // Internacionais clássicos
    "Harry Potter Pedra Filosofal",
    "Harry Potter Câmara Secreta",
    "O Senhor dos Anéis",
    "O Hobbit Tolkien",
    "A Guerra dos Tronos George R.R. Martin",
    "1984 George Orwell",
    "Admirável Mundo Novo Huxley",
    "O Grande Gatsby Fitzgerald",
    "Crime e Castigo Dostoiévski",
    "Guerra e Paz Tolstói",
    "O Processo Kafka",
    "A Metamorfose Kafka",
    "Cem Anos de Solidão García Márquez",
    "O Amor nos Tempos do Cólera",
    "Dom Quixote Cervantes",
    "O Pequeno Príncipe",
    "A Divina Comédia Dante",
    "Ilíada Homero",
    "Hamlet Shakespeare",
    "Romeu e Julieta Shakespeare",
    "Orgulho e Preconceito Jane Austen",
    "Razão e Sensibilidade Jane Austen",
    "Jane Eyre Charlotte Brontë",
    "O Morro dos Ventos Uivantes",
    "Drácula Bram Stoker",
    "Frankenstein Mary Shelley",
    "Moby Dick Herman Melville",
    "Os Miseráveis Victor Hugo",
    "O Conde de Monte Cristo",
    "Sherlock Holmes Doyle",
    "A Ilha do Tesouro",
    "As Aventuras de Tom Sawyer",
    "O Catcher no Campo de Centeio Salinger",
    "O Sol é para Todos Harper Lee",
    "Matar um Rouxinol Harper Lee",
    "O Velho e o Mar Hemingway",
    "Por Quem os Sinos Dobram Hemingway",

    // Internacionais modernos/bestsellers
    "Duna Frank Herbert",
    "Fundação Isaac Asimov",
    "O Guia do Mochileiro das Galáxias",
    "Jogos Vorazes Suzanne Collins",
    "Divergente Veronica Roth",
    "Crepúsculo Stephenie Meyer",
    "A Culpa é das Estrelas John Green",
    "Procurando Alaska John Green",
    "O Ladrão de Raios Rick Riordan",
    "A Cabana William Paul Young",
    "O Código Da Vinci Dan Brown",
    "Anjos e Demônios Dan Brown",
    "O Símbolo Perdido Dan Brown",
    "As Cinquenta Sombras de Grey",
    "Sapiens Yuval Noah Harari",
    "Homo Deus Yuval Noah Harari",
    "O Poder do Hábito Charles Duhigg",
    "Pai Rico Pai Pobre Robert Kiyosaki",
    "Mindset Carol Dweck",
    "Como Fazer Amigos e Influenciar Pessoas",
    "O Monge que Vendeu sua Ferrari",
    "A Arte da Guerra Sun Tzu",
    "Pense e Enriqueça Napoleon Hill",
    "O Nome do Vento Patrick Rothfuss",
    "A Roda do Tempo Robert Jordan",
    "O Problema dos Três Corpos Liu Cixin",
    "Ender em Exílio Orson Scott Card",
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizeCategory(raw: string[]): string {
    const joined = raw.join(" ").toLowerCase()
    if (/(ficção cient|science fiction|sci.fi|scifi)/.test(joined)) return "Ficção Científica"
    if (/(fantas|fantasy)/.test(joined)) return "Fantasia"
    if (/(romance|fiction|ficção)/.test(joined)) return "Romance"
    if (/(thriller|suspense)/.test(joined)) return "Thriller"
    if (/(terror|horror)/.test(joined)) return "Terror"
    if (/(biograf|memoir|autobiography)/.test(joined)) return "Biografia"
    if (/(histór|history)/.test(joined)) return "História"
    if (/(aventur|adventure)/.test(joined)) return "Aventura"
    if (/(policial|crime|mystery|detetive)/.test(joined)) return "Policial"
    if (/(clássic|classic|literatur)/.test(joined)) return "Literatura"
    if (/(autoajuda|self.help|desenvolvimento)/.test(joined)) return "Autoajuda"
    return "Ficção"
}

function randomPrice(): string {
    const prices = [19.90, 24.90, 29.90, 34.90, 39.90, 44.90, 49.90, 54.90, 59.90, 69.90, 79.90]
    return prices[Math.floor(Math.random() * prices.length)].toFixed(2)
}

// Detect if text is likely English (simple heuristic)
function isEnglish(text: string): boolean {
    const englishWords = /\b(the|and|of|to|a|in|is|it|that|was|he|she|his|her|they|with|for|on|are|as|at|this|have|from|or|had|by|hot|but|some|what|there|we|can|out|other|were|all|your|when|up|use|how|said|an|each|she|do|time|if|will|way|about|many|then|them|would|write|like|so|these|her|long|make|thing|see|him|two|has|look|more|day|could|go|come|did|down|been|part|too|where)\b/gi
    const matches = (text.match(englishWords) || []).length
    const words = text.split(/\s+/).length
    return words > 10 && matches / words > 0.08
}

// Translate description to pt-BR if it appears to be in English
async function translateToPtBR(text: string): Promise<string> {
    if (!isEnglish(text)) return text
    try {
        const trimmed = text.slice(0, 1500) // API limit safety
        const result = await translate(trimmed, { to: "pt" })
        return result.text
    } catch {
        return text // fallback to original on error
    }
}

// Search Google Books by specific title query
async function fetchBooks(query: string) {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=3&key=${API_KEY}`
    const res = await fetch(url)
    const data = await res.json() as any
    return (data.items ?? []).slice(0, 1) // best match only
}

async function getOrCreateCategory(name: string): Promise<string> {
    const existing = await prisma.category.findUnique({ where: { name } })
    if (existing) return existing.id
    const created = await prisma.category.create({ data: { name } })
    console.log(`  📂 Categoria criada: ${name}`)
    return created.id
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
    console.log(`🚀 Seed com ${BOOK_SEARCHES.length} buscas de livros populares...\n`)

    let inserted = 0
    let skipped = 0
    let translated = 0

    for (const query of BOOK_SEARCHES) {
        const items = await fetchBooks(query)

        for (const item of items) {
            const info = item.volumeInfo
            if (!info) continue

            const title: string = info.title
            const authors: string[] = info.authors ?? []
            let description: string = info.description ?? ""
            const categories: string[] = info.categories ?? []
            const imageUrl: string | null =
                (info.imageLinks?.extraLarge ??
                    info.imageLinks?.large ??
                    info.imageLinks?.thumbnail)?.replace("http://", "https://") ?? null

            if (!title || authors.length === 0 || !description) {
                skipped++
                continue
            }

            // Translate if description is in English
            if (isEnglish(description)) {
                const original = description
                description = await translateToPtBR(description)
                if (description !== original) translated++
                // Small delay to avoid rate-limiting the translator
                await new Promise((r) => setTimeout(r, 200))
            }

            const author = authors[0]
            const categoryName = normalizeCategory(categories)
            const categoryId = await getOrCreateCategory(categoryName)

            try {
                await prisma.book.create({
                    data: {
                        title: title.trim(),
                        author: author.trim(),
                        description: description.trim(),
                        price: randomPrice(),
                        imageUrl,
                        categoryId,
                    },
                })
                console.log(`  ✅ ${title}`)
                inserted++
            } catch (err: any) {
                if (err.code === "P2002") {
                    skipped++ // duplicate title — silent
                } else {
                    console.error(`  ❌ "${title}":`, err.message)
                    skipped++
                }
            }
        }

        await new Promise((r) => setTimeout(r, 150))
    }

    console.log(`\n🎉 Concluído!`)
    console.log(`   ✅ Inseridos:    ${inserted}`)
    console.log(`   🌐 Traduzidos:   ${translated}`)
    console.log(`   ⏭️  Ignorados:    ${skipped}`)
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
