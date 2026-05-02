<template>
    <header class="navbar bg-base-100 border-b border-base-200 min-h-16 px-6 shrink-0">
        <div class="navbar-start">
            <span class="font-semibold text-base-content">{{ pageTitle }}</span>
        </div>
        <div class="navbar-end gap-4">
            <span class="text-sm text-base-content/60 font-mono">{{ time }}</span>
            <div class="divider divider-horizontal mx-0 h-5"></div>
            <div class="flex items-center gap-2">
                <span :class="['badge badge-xs', online ? 'badge-success' : 'badge-error']"></span>
                <span class="text-sm text-base-content/60">{{ online ? 'Online' : 'Offline' }}</span>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route  = useRoute()
const time   = ref('')
const online = ref(navigator.onLine)

const titles = {
    '/kasir':      'Kasir',
    '/dashboard':  'Dashboard',
    '/produk':     'Produk',
    '/transaksi':  'Transaksi',
    '/laporan':    'Laporan',
    '/pengaturan': 'Pengaturan',
}

const pageTitle = computed(() => titles[route.path] ?? '')

let timer = null

function updateTime() {
    time.value = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

onMounted(() => {
    updateTime()
    timer = setInterval(updateTime, 1000)
    window.addEventListener('online',  () => online.value = true)
    window.addEventListener('offline', () => online.value = false)
})

onUnmounted(() => clearInterval(timer))
</script>
