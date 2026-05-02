function index(req, res) {
    const produkList = [
        { id: 1, nama: 'Produk A', harga: 10000 },
        { id: 2, nama: 'Produk B', harga: 20000 },
        { id: 3, nama: 'Produk C', harga: 30000 },
    ]
    res.json(produkList, 200)
}

function store(req, res) {
    res.status(201).json({})
}

function update(req, res) {
    res.json({})
}

function destroy(req, res) {
    res.status(204).send()
}

export default { index, store, update, destroy }
