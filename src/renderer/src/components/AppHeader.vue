<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route     = useRoute()
const pageTitle = computed(() => {
    const titles = { '/dashboard': 'Dashboard', '/produk': 'Produk' }
    return titles[route.path] || ''
})
</script>

<template>
    <div class="navbar bg-base-100 border-b border-base-content/10 min-h-12 px-4">
        <div class="flex-1 font-semibold">{{ pageTitle }}</div>
        <div class="flex-none">
            <span class="text-sm text-base-content/50">POS Desktop v1.0</span>
        </div>
    </div>
</template>
