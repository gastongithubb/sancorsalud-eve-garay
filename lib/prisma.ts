import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { Client, createClient } from '@libsql/client'

function createPrismaClient() {
  const libsql: Client = createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  })

  const adapter = new PrismaLibSQL(libsql)
  const prisma = new PrismaClient()

  const originalConnect = prisma.$connect.bind(prisma)
  const originalDisconnect = prisma.$disconnect.bind(prisma)

  prisma.$connect = async () => {
    await originalConnect()
  }

  prisma.$disconnect = async () => {
    await libsql.execute('SELECT 1')
    await originalDisconnect()
  }

  return prisma
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma