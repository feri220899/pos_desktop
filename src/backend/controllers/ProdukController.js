import Produk from '../models/Produk'
import Response from '../helpers/response'

function index(req, res) {
    try {
        Response.success(res, Produk.all())
    } catch {
        Response.serverError(res)
    }
}

function store(req, res) {
    try {
        const result = Produk.create(req.body)
        Response.created(res, { id: result.lastInsertRowid })
    } catch {
        Response.serverError(res)
    }
}

function update(req, res) {
    try {
        if (!Produk.find(req.params.id)) return Response.notFound(res)
        Produk.update(req.params.id, req.body)
        Response.success(res)
    } catch {
        Response.serverError(res)
    }
}

function destroy(req, res) {
    try {
        if (!Produk.find(req.params.id)) return Response.notFound(res)
        Produk.destroy(req.params.id)
        Response.noContent(res)
    } catch {
        Response.serverError(res)
    }
}

export default { index, store, update, destroy }
