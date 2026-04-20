import { PrismaClient } from '../generated/prisma/client.js'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

const client = createClient({
  url: 'file:./prisma/dev.db',
})

const adapter = new PrismaLibSQL(client)
const prisma = new PrismaClient({ adapter })

export default prisma