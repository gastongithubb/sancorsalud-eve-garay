import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

const libsql = createClient({
  url: process.env.NEXT_PUBLIC_TURSO_DATABASE_URL as string,
  authToken: process.env.NEXT_PUBLIC_TURSO_AUTH_TOKEN,
})

const adapter = new PrismaLibSQL(libsql)

const prismaClientSingleton = () => {
  return new PrismaClient().$extends({
    query: {
      async $allOperations({ args, query, operation }) {
        const result = await query(args)
        return result
      },
    },
  })
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma