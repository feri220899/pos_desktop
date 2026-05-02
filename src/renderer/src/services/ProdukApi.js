import apibackend from './api.js'


async function getProduk() {
   return await apibackend.get('/api/produk')
}

async function getProdukById(id) {
    return await apibackend.get(`/api/produk/detail/${id}`)
}

export default {
    getProduk,
    getProdukById
}