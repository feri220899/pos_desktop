import Produk from '../models/Produk'

function index(req, res) {
    res.json({ success: true, data: Produk.all() })
}

function store(req, res) {
    const result = Produk.create(req.body)
    res.status(201).json({ success: true, data: { id: result.lastInsertRowid } })
}

function update(req, res) {
    Produk.update(req.params.id, req.body)
    res.json({ success: true })
}

function destroy(req, res) {
    Produk.delete(req.params.id)
    res.status(204).send()
}

export default { index, store, update, destroy }
