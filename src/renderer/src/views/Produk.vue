<script setup>
import { ref, onMounted } from 'vue'
import ProdukApi from '../services/ProdukApi.js'

const produk = ref([])

onMounted(async () => {
    try {
        const response = await ProdukApi.getProduk()
        produk.value = response.data.data
    } catch (error) {
        console.error('Error fetching produk:', error)
    }
})

</script>

<template>
    <div>
        <div class="flex justify-between items-center mb-4">
            <h1 class="text-xl font-bold">Produk</h1>
            <button className="btn btn-neutral">Neutral</button>
        </div>

        <div class="overflow-x-auto bg-base-100 rounded-box shadow">
            <table class="table table-zebra">
                <thead>
                    <tr>
                        <th>Nama</th>
                        <th>Harga</th>
                        <th>Stok</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="produk.length === 0">
                        <td colspan="4" class="text-center text-base-content/50 py-8">
                            Belum ada data produk
                        </td>
                    </tr>
                    <tr v-for="item in produk" :key="item.id">
                        <td>{{ item.nama }}</td>
                        <td>{{ item.harga }}</td>
                        <td>{{ item.stok }}</td>
                        <td>
                            <button class="btn btn-ghost btn-xs">Edit</button>
                            <button class="btn btn-ghost btn-xs text-error">Hapus</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
