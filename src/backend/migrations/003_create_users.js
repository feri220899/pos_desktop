export default {
    name: '003_create_users',
    up(db) {
        db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                username   TEXT    NOT NULL UNIQUE,
                password   TEXT    NOT NULL,
                role_id    INTEGER NOT NULL REFERENCES roles(id),
                active     INTEGER NOT NULL DEFAULT 1,
                created_at TEXT    DEFAULT (datetime('now')),
                updated_at TEXT    DEFAULT (datetime('now'))
            )
        `)
    },
}
