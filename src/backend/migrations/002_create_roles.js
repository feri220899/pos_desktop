export default {
    name: '002_create_roles',
    up(db) {
        db.exec(`
            CREATE TABLE IF NOT EXISTS roles (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                name        TEXT    NOT NULL UNIQUE,
                permissions TEXT    NOT NULL DEFAULT '[]',
                created_at  TEXT    DEFAULT (datetime('now')),
                updated_at  TEXT    DEFAULT (datetime('now'))
            )
        `)
    },
}
