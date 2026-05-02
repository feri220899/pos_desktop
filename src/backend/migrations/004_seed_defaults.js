import bcrypt from 'bcryptjs'

const ALL_PERMISSIONS   = ['dashboard', 'kasir', 'produk', 'transaksi', 'laporan']
const KASIR_PERMISSIONS = ['dashboard', 'kasir', 'transaksi']

export default {
    name: '004_seed_defaults',
    up(db) {
        db.prepare(`INSERT OR IGNORE INTO roles (name, permissions) VALUES (?, ?)`).run('admin', JSON.stringify(ALL_PERMISSIONS))
        db.prepare(`INSERT OR IGNORE INTO roles (name, permissions) VALUES (?, ?)`).run('kasir', JSON.stringify(KASIR_PERMISSIONS))

        const adminRole = db.prepare(`SELECT id FROM roles WHERE name = 'admin'`).get()
        const hash      = bcrypt.hashSync('admin123', 10)
        db.prepare(`INSERT OR IGNORE INTO users (username, password, role_id) VALUES (?, ?, ?)`).run('admin', hash, adminRole.id)
    },
}
