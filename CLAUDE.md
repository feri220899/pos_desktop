# POS Desktop — Instruksi Backend

## Struktur Backend (Electron embedded Express)

```
src/backend/
  config/         # DatabaseService, Route
  controllers/    # handler request HTTP
  helpers/        # response.js
  middleware/     # auth.js
  migrations/     # DDL tabel
  models/         # query SQLite via better-sqlite3
  router/         # router.js (definisi routes)
```

---

## Konvensi Controller

Setiap controller **wajib** mengikuti pola berikut tanpa pengecualian.

### Template

```js
import ModelNama from '../models/ModelNama'
import Response  from '../helpers/response'

function index(req, res) {
    try {
        Response.success(res, ModelNama.all())
    } catch {
        Response.serverError(res)
    }
}

function show(req, res) {
    try {
        const data = ModelNama.find(req.params.id)
        if (!data) return Response.notFound(res)
        Response.success(res, data)
    } catch {
        Response.serverError(res)
    }
}

function store(req, res) {
    try {
        const result = ModelNama.create(req.body)
        Response.created(res, { id: result.lastInsertRowid })
    } catch {
        Response.serverError(res)
    }
}

function update(req, res) {
    try {
        if (!ModelNama.find(req.params.id)) return Response.notFound(res)
        ModelNama.update(req.params.id, req.body)
        Response.success(res)
    } catch {
        Response.serverError(res)
    }
}

function destroy(req, res) {
    try {
        if (!ModelNama.find(req.params.id)) return Response.notFound(res)
        ModelNama.destroy(req.params.id)
        Response.noContent(res)
    } catch {
        Response.serverError(res)
    }
}

export default { index, show, store, update, destroy }
```

### Aturan

- Selalu `import Response from '../helpers/response'` — jangan pakai `res.json()` langsung
- Setiap fungsi dibungkus `try/catch`, catch selalu `Response.serverError(res)`
- Cek keberadaan data dengan `Model.find()` sebelum update/delete, return `Response.notFound(res)` jika null
- Ekspor sebagai plain object `export default { ... }`, bukan class
- Nama fungsi: `index`, `show`, `store`, `update`, `destroy` (sesuai REST)

### Helper Response yang tersedia

| Method | Status | Kapan dipakai |
|---|---|---|
| `Response.success(res, data?)` | 200 | GET berhasil, PUT berhasil |
| `Response.created(res, data?)` | 201 | POST berhasil |
| `Response.noContent(res)` | 204 | DELETE berhasil |
| `Response.badRequest(res, msg?)` | 400 | Validasi gagal |
| `Response.notFound(res, msg?)` | 404 | Data tidak ditemukan |
| `Response.serverError(res, msg?)` | 500 | Error tak terduga |

---

## Konvensi Model

```js
import DatabaseService from '../config/DatabaseService'

const db = () => DatabaseService.get()

export default {
    all()           { return db().prepare('SELECT * FROM nama_tabel').all() },
    find(id)        { return db().prepare('SELECT * FROM nama_tabel WHERE id = ?').get(id) },
    create(payload) { /* INSERT */ },
    update(id, payload) { /* UPDATE dengan updated_at = datetime("now") */ },
    destroy(id)     { return db().prepare('DELETE FROM nama_tabel WHERE id = ?').run(id) },
}
```

- Selalu pakai `const db = () => DatabaseService.get()` (lazy getter)
- Kolom `updated_at` di-update manual: `updated_at = datetime("now")`
- Destruktur payload di parameter (`{ nama, harga }`) bukan terima object mentah

---

## Konvensi Router

```js
import Route          from '../config/Route'
import auth           from '../middleware/auth'
import NamaController from '../controllers/NamaController'

Route.group('/api/nama', [auth], (router) => {
    router.get('/',       NamaController.index)
    router.get('/:id',    NamaController.show)
    router.post('/',      NamaController.store)
    router.put('/:id',    NamaController.update)
    router.delete('/:id', NamaController.destroy)
})
```

- Semua route dimasukkan ke `src/backend/router/router.js`
- Selalu pakai `[auth]` middleware kecuali endpoint publik
- Prefix route: `/api/nama-resource` (kebab-case, plural)

---

## Konvensi Migration

```js
export default {
    name: 'NNN_create_nama_tabel',
    up(db) {
        db.exec(`
            CREATE TABLE IF NOT EXISTS nama_tabel (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                -- kolom bisnis --
                created_at TEXT DEFAULT (datetime('now')),
                updated_at TEXT DEFAULT (datetime('now'))
            )
        `)
    },
}
```

- Nama file: `NNN_create_nama_tabel.js` (nomor urut 3 digit)
- Selalu sertakan `created_at` dan `updated_at`
- Daftarkan di `src/backend/migrations/index.js`

---

## Konvensi API Service (Renderer)

```js
import apibackend from './api.js'

async function getAll()     { return await apibackend.get('/api/nama') }
async function getById(id)  { return await apibackend.get(`/api/nama/${id}`) }
async function create(data) { return await apibackend.post('/api/nama', data) }
async function update(id, data) { return await apibackend.put(`/api/nama/${id}`, data) }
async function remove(id)   { return await apibackend.delete(`/api/nama/${id}`) }

export default { getAll, getById, create, update, remove }
```

- Satu file per resource: `NamaApi.js` di `src/renderer/src/services/`
- Selalu `export default` plain object
- Nama fungsi: `getAll`, `getById`, `create`, `update`, `remove`
