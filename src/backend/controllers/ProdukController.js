function index(req, res) {
    res.json([])
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
