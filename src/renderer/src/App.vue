<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from './components/AppSidebar.vue'
import AppHeader  from './components/AppHeader.vue'

const route     = useRoute()
const hasLayout = computed(() => route.meta.layout !== false)
</script>

<template>
    <!-- Halaman tanpa sidebar (aktivasi, dll) -->
    <RouterView v-if="!hasLayout" />

    <!-- Shell utama -->
     
    <div v-else class="flex h-screen bg-base-200">
        <AppSidebar />
        <div class="flex flex-col flex-1 overflow-hidden">
            <AppHeader />
            <main class="flex-1 overflow-y-auto p-6">
                <RouterView />
            </main>
        </div>
    </div>
</template>
