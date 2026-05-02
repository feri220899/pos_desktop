export default {
    name: '001_create_produk',
    up(db) {
        db.exec(`
            CREATE TABLE IF NOT EXISTS produk (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                nama       TEXT    NOT NULL,
                harga      INTEGER NOT NULL DEFAULT 0,
                stok       INTEGER NOT NULL DEFAULT 0,
                created_at TEXT    DEFAULT (datetime('now')),
                updated_at TEXT    DEFAULT (datetime('now'))
            )
        `)
    },
}
