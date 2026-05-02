function success(res, data = null, message = 'Berhasil') {
    return res.status(200).json({ success: true, message, data })
}

function created(res, data = null, message = 'Data berhasil dibuat') {
    return res.status(201).json({ success: true, message, data })
}

function noContent(res) {
    return res.status(204).send()
}

function badRequest(res, message = 'Permintaan tidak valid') {
    return res.status(400).json({ success: false, message, data: null })
}

function notFound(res, message = 'Data tidak ditemukan') {
    return res.status(404).json({ success: false, message, data: null })
}

function serverError(res, message = 'Terjadi kesalahan server') {
    return res.status(500).json({ success: false, message, data: null })
}

export default { success, created, noContent, badRequest, notFound, serverError }
