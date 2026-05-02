import DatabaseService from '../config/DatabaseService'

const db = () => DatabaseService.get()

export default {
    all() {
        return db().prepare('SELECT * FROM produk').all()
    },

    find(id) {
        return db().prepare('SELECT * FROM produk WHERE id = ?').get(id)
    },

    create({ nama, harga = 0, stok = 0 }) {
        return db()
            .prepare('INSERT INTO produk (nama, harga, stok) VALUES (?, ?, ?)')
            .run(nama, harga, stok)
    },

    update(id, { nama, harga, stok }) {
        return db()
            .prepare('UPDATE produk SET nama = ?, harga = ?, stok = ?, updated_at = datetime("now") WHERE id = ?')
            .run(nama, harga, stok, id)
    },

    destroy(id) {
        return db().prepare('DELETE FROM produk WHERE id = ?').run(id)
    },
}
