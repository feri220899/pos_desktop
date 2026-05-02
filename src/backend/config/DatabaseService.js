import Database from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'
import migrations from '../migrations'

let db = null
let db_name = 'pos.db'

function connect() {
    if (db) return db
    const dbPath = join(app.getPath('userData'), db_name)
    db = new Database(dbPath)
    db.pragma('journal_mode = WAL')
    db.pragma('foreign_keys = ON')
    runMigrations()
    return db
}

function runMigrations() {
    db.exec(`
        CREATE TABLE IF NOT EXISTS migrations (
            name TEXT PRIMARY KEY,
            ran_at TEXT DEFAULT (datetime('now'))
        )
    `)

    const ran = db.prepare('SELECT name FROM migrations').all().map(r => r.name)

    for (const { name, up } of migrations) {
        if (ran.includes(name)) continue
        db.transaction(() => {
            up(db)
            db.prepare('INSERT INTO migrations (name) VALUES (?)').run(name)
        })()
    }
}

function get() {
    if (!db) connect()
    return db
}

export default { connect, get }
