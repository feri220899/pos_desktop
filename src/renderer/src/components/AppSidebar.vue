<template>
    <aside data-theme="light" class="w-64 flex flex-col h-screen shrink-0 bg-base-100 border-r border-base-300">

        <!-- Logo -->
        <div class="flex items-center gap-3 px-4 h-16 shrink-0 border-b border-base-300">
            <div class="btn btn-primary btn-square btn-sm no-animation pointer-events-none">
                <LayoutGrid class="size-4" />
            </div>
            <div>
                <div class="text-sm font-bold text-base-content leading-tight">POS Desktop</div>
                <div class="text-xs text-base-content/40">{{ mode === 'master' ? '● Master' : '○ Client' }}</div>
            </div>
        </div>

        <!-- Nav -->
        <nav class="flex-1 overflow-y-auto py-3 px-2 space-y-4">

            <div v-for="section in menu" :key="section.title">
                <p class="px-3 mb-1 text-xs font-semibold uppercase tracking-wider text-base-content/30">
                    {{ section.title }}
                </p>
                <ul class="space-y-0.5">
                    <li v-for="item in section.items" :key="item.to">
                        <RouterLink :to="item.to" :class="navClass(item.to)">
                            <component :is="item.icon" class="size-4 shrink-0" />
                            {{ item.label }}
                        </RouterLink>
                    </li>
                </ul>
            </div>

        </nav>

        <!-- Bottom -->
        <div class="px-2 py-3 border-t border-base-300">
            <RouterLink to="/pengaturan" :class="navClass('/pengaturan')">
                <Settings class="size-4 shrink-0" />
                Pengaturan
            </RouterLink>
        </div>

    </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
    LayoutGrid, Monitor, ShoppingBag,
    ClipboardList, BarChart2, Settings
} from 'lucide-vue-next'

const route = useRoute()
const mode  = ref('master')

function navClass(path) {
    const base = 'flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium transition-colors'
    return route.path === path
        ? `${base} bg-primary text-primary-content`
        : `${base} text-base-content/70 hover:bg-base-200 hover:text-base-content`
}

const menu = [
    {
        title: 'Utama',
        items: [
            { to: '/kasir',     label: 'Kasir',     icon: Monitor      },
            { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid   },
        ],
    },
    {
        title: 'Manajemen',
        items: [
            { to: '/produk',    label: 'Produk',    icon: ShoppingBag  },
            { to: '/transaksi', label: 'Transaksi', icon: ClipboardList },
        ],
    },
    {
        title: 'Laporan',
        items: [
            { to: '/laporan', label: 'Laporan', icon: BarChart2 },
        ],
    },
]

onMounted(async () => {
    mode.value = await window.api.config.get('app_mode') ?? 'master'
})
</script>
