import DatabaseService from '../config/DatabaseService'

const db = () => DatabaseService.get()

export default {
    all() {
        return db().prepare('SELECT * FROM roles').all().map(parse)
    },

    find(id) {
        const row = db().prepare('SELECT * FROM roles WHERE id = ?').get(id)
        return row ? parse(row) : null
    },

    findByName(name) {
        const row = db().prepare('SELECT * FROM roles WHERE name = ?').get(name)
        return row ? parse(row) : null
    },

    create({ name, permissions = [] }) {
        return db().prepare(`
            INSERT INTO roles (name, permissions) VALUES (?, ?)
        `).run(name, JSON.stringify(permissions))
    },

    update(id, { name, permissions }) {
        return db().prepare(`
            UPDATE roles SET name = ?, permissions = ?, updated_at = datetime('now') WHERE id = ?
        `).run(name, JSON.stringify(permissions), id)
    },

    destroy(id) {
        return db().prepare('DELETE FROM roles WHERE id = ?').run(id)
    },
}

function parse(row) {
    return { ...row, permissions: JSON.parse(row.permissions) }
}
