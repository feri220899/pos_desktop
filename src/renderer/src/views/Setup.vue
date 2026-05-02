<template>
    <div class="min-h-screen bg-base-200 flex items-center justify-center">
        <div class="card bg-base-100 shadow-xl w-full max-w-md">
            <div class="card-body gap-6">

                <div class="text-center">
                    <h1 class="text-2xl font-bold">Setup Awal</h1>
                    <p class="text-base-content/60 mt-1">Pilih mode aplikasi untuk perangkat ini</p>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <button
                        class="btn btn-outline h-auto py-6 flex-col gap-2"
                        :class="{ 'btn-primary': mode === 'master' }"
                        @click="pilihMode('master')"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                        <span class="font-semibold">Master</span>
                        <span class="text-xs font-normal opacity-70">Simpan database lokal</span>
                    </button>

                    <button
                        class="btn btn-outline h-auto py-6 flex-col gap-2"
                        :class="{ 'btn-primary': mode === 'client' }"
                        @click="pilihMode('client')"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span class="font-semibold">Client</span>
                        <span class="text-xs font-normal opacity-70">Konek ke master</span>
                    </button>
                </div>

                <!-- Master: port config -->
                <div v-if="mode === 'master'" class="form-control gap-1">
                    <label class="label">
                        <span class="label-text">Port Server</span>
                        <span class="label-text-alt opacity-60">default: 3001</span>
                    </label>
                    <input v-model="port" type="number" placeholder="3001" class="input input-bordered" />
                </div>

                <!-- Client: auto discovery -->
                <div v-if="mode === 'client'" class="flex flex-col gap-3">
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-medium">Master tersedia di jaringan</span>
                        <button class="btn btn-sm btn-ghost" :disabled="scanning" @click="startScan">
                            <span v-if="scanning" class="loading loading-spinner loading-xs"></span>
                            <span v-else>↻</span>
                            Scan
                        </button>
                    </div>

                    <div v-if="scanning && masters.length === 0" class="flex items-center gap-2 text-sm text-base-content/60">
                        <span class="loading loading-dots loading-sm"></span>
                        Mencari master di jaringan...
                    </div>

                    <div v-if="!scanning && masters.length === 0" class="text-sm text-base-content/60 text-center py-4">
                        Tidak ada master ditemukan
                    </div>

                    <div class="flex flex-col gap-2">
                        <button
                            v-for="m in masters"
                            :key="m.ip + m.port"
                            class="btn btn-outline justify-start gap-3"
                            :class="{ 'btn-primary': selectedMaster?.ip === m.ip }"
                            @click="selectedMaster = m"
                        >
                            <span class="size-2 rounded-full bg-success"></span>
                            <span>{{ m.name }}</span>
                            <span class="text-xs opacity-60 ml-auto">{{ m.ip }}:{{ m.port }}</span>
                        </button>
                    </div>
                </div>

                <div v-if="error" class="alert alert-error">
                    <span>{{ error }}</span>
                </div>

                <button
                    class="btn btn-primary"
                    :disabled="!bisa || loading"
                    @click="simpan"
                >
                    <span v-if="loading" class="loading loading-spinner loading-sm"></span>
                    Simpan & Lanjutkan
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const mode           = ref(null)
const port           = ref(3001)
const masters        = ref([])
const selectedMaster = ref(null)
const scanning       = ref(false)
const loading        = ref(false)
const error          = ref(null)

const bisa = computed(() => {
    if (!mode.value) return false
    if (mode.value === 'client') return !!selectedMaster.value
    return true
})

function pilihMode(m) {
    mode.value = m
    if (m === 'client') startScan()
}

function startScan() {
    masters.value        = []
    selectedMaster.value = null
    scanning.value       = true

    window.api.discovery.offFound()
    window.api.discovery.onFound((master) => {
        const sudahAda = masters.value.some(m => m.ip === master.ip && m.port === master.port)
        if (!sudahAda) masters.value.push(master)
    })

    window.api.discovery.scan()

    setTimeout(() => { scanning.value = false }, 5000)
}

async function simpan() {
    error.value = null
    loading.value = true
    try {
        await window.api.config.set('app_mode', mode.value)

        if (mode.value === 'master') {
            await window.api.config.set('server_port', Number(port.value) || 3001)
            window.api.server.start()
            window.api.discovery.advertise()
        } else {
            await window.api.config.set('master_ip',   selectedMaster.value.ip)
            await window.api.config.set('master_port', selectedMaster.value.port)
        }

        router.push('/aktivasi')
    } catch {
        error.value = 'Gagal menyimpan konfigurasi.'
    } finally {
        loading.value = false
    }
}

onUnmounted(() => {
    window.api.discovery.stopScan()
    window.api.discovery.offFound()
})
</script>
