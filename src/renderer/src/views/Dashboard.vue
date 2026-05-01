<script setup>
const stats = [
    { label: 'Transaksi Hari Ini', value: '0',    desc: 'transaksi' },
    { label: 'Pendapatan Hari Ini', value: 'Rp 0', desc: 'total'    },
    { label: 'Total Produk',        value: '0',    desc: 'produk'    },
]

async function testAktivasi() {
    const test = await window.api.device.getId()
    console.log(test);
        
}

</script>

<template>
    <div>
        <h1 class="text-xl font-bold mb-6">Dashboard</h1>

        <div class="grid grid-cols-3 gap-4">
            <div v-for="stat in stats" :key="stat.label"
                 class="stat bg-base-100 rounded-box shadow">
                <div class="stat-title">{{ stat.label }}</div>
                <div class="stat-value text-primary">{{ stat.value }}</div>
                <div class="stat-desc">{{ stat.desc }}</div>
            </div>
        </div>
        <div class="mt-6">
            <button class="btn btn-primary" @click="testAktivasi">Test Aktifasi</button>
        </div>
    </div>
</template>
