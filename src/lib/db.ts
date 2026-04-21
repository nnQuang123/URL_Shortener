import Database from 'better-sqlite3'
import path from 'path'

const db = new Database(path.join(__dirname, '../../prisma/dev.db'))

db.exec(`
  CREATE TABLE IF NOT EXISTS urls (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    code         TEXT    NOT NULL UNIQUE,
    original_url TEXT    NOT NULL,
    created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
    clicks       INTEGER NOT NULL DEFAULT 0
  )
`)

export default db