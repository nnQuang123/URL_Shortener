import path from 'node:path'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  earlyAccess: true,
  schema: './prisma/schema.prisma',
  migrate: {
    async adapter() {
      const { PrismaLibSQL } = await import('@prisma/adapter-libsql')
      const { createClient } = await import('@libsql/client')

      const client = createClient({
        url: 'file:./prisma/dev.db',  // File database nằm trong thư mục prisma/
      })

      return new PrismaLibSQL(client)
    }
  }
})