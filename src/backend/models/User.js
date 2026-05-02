import DatabaseService from '../config/DatabaseService'

const db = () => DatabaseService.get()

const SELECT_WITH_ROLE = `
    SELECT u.id, u.username, u.password, u.active, u.role_id, u.created_at, u.updated_at,
           r.name AS role_name, r.permissions
    FROM users u
    JOIN roles r ON r.id = u.role_id
`

export default {
    all() {
        return db().prepare(`${SELECT_WITH_ROLE} ORDER BY u.id`).all().map(parse)
    },

    find(id) {
        const row = db().prepare(`${SELECT_WITH_ROLE} WHERE u.id = ?`).get(id)
        return row ? parse(row) : null
    },

    findByUsername(username) {
        const row = db().prepare(`${SELECT_WITH_ROLE} WHERE u.username = ?`).get(username)
        return row ? parse(row) : null
    },

    getPasswordHash(id) {
        const row = db().prepare('SELECT password FROM users WHERE id = ?').get(id)
        return row?.password ?? null
    },

    create({ username, password, role_id, active = 1 }) {
        return db().prepare(`
            INSERT INTO users (username, password, role_id, active) VALUES (?, ?, ?, ?)
        `).run(username, password, role_id, active)
    },

    update(id, { username, password, role_id, active }) {
        const fields = []
        const values = []

        if (username !== undefined) { fields.push('username = ?');   values.push(username) }
        if (password !== undefined) { fields.push('password = ?');   values.push(password) }
        if (role_id  !== undefined) { fields.push('role_id = ?');    values.push(role_id)  }
        if (active   !== undefined) { fields.push('active = ?');     values.push(active)   }

        fields.push(`updated_at = datetime('now')`)
        values.push(id)

        return db().prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`).run(...values)
    },

    destroy(id) {
        return db().prepare('DELETE FROM users WHERE id = ?').run(id)
    },
}

function parse(row) {
    const { password, ...safe } = row
    return { ...safe, permissions: JSON.parse(row.permissions) }
}
