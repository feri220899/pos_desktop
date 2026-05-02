<template>
    <div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
        <div class="card bg-base-100 shadow-xl w-full max-w-lg">
            <div class="card-body gap-6">

                <!-- Header -->
                <div class="text-center">
                    <h1 class="card-title justify-center text-2xl">Pengaturan Awal Kasir</h1>
                    <p class="text-base-content/60 text-sm mt-1">Tentukan peran komputer ini dalam sistem kasir Anda</p>
                </div>

                <!-- Steps -->
                <ul class="steps steps-horizontal w-full text-xs">
                    <li class="step" :class="mode ? 'step-primary' : ''">Pilih Peran</li>
                    <li class="step" :class="bisa ? 'step-primary' : ''">Konfigurasi</li>
                    <li class="step">Selesai</li>
                </ul>

                <!-- Mode selection: radio cards -->
                <div class="grid grid-cols-2 gap-3">

                    <label class="card card-border border-2 cursor-pointer transition-colors has-checked:border-primary has-checked:bg-primary/5">
                        <div class="card-body items-center gap-2 py-5">
                            <input type="radio" name="mode" class="hidden" value="master" v-model="mode" @change="pilihMode('master')" />
                            <Server class="size-8" :class="mode === 'master' ? 'text-primary' : 'text-base-content/40'" />
                            <div class="text-center">
                                <p class="font-bold text-sm">Kasir Utama</p>
                                <p class="text-xs text-base-content/50 mt-0.5 leading-relaxed">Menyimpan semua data &amp; laporan</p>
                            </div>
                            <div class="badge badge-primary badge-sm" v-if="mode === 'master'">Dipilih</div>
                        </div>
                    </label>

                    <label class="card card-border border-2 cursor-pointer transition-colors has-checked:border-primary has-checked:bg-primary/5">
                        <div class="card-body items-center gap-2 py-5">
                            <input type="radio" name="mode" class="hidden" value="client" v-model="mode" @change="pilihMode('client')" />
                            <Monitor class="size-8" :class="mode === 'client' ? 'text-primary' : 'text-base-content/40'" />
                            <div class="text-center">
                                <p class="font-bold text-sm">Kasir Tambahan</p>
                                <p class="text-xs text-base-content/50 mt-0.5 leading-relaxed">Terhubung ke kasir utama via WiFi</p>
                            </div>
                            <div class="badge badge-primary badge-sm" v-if="mode === 'client'">Dipilih</div>
                        </div>
                    </label>

                </div>

                <!-- Info alert -->
                <div v-if="mode === 'master'" role="alert" class="alert alert-info alert-soft text-sm py-2.5">
                    <Info class="size-4 shrink-0 opacity-70" />
                    <span>Kasir utama harus <strong>selalu menyala</strong> agar kasir tambahan bisa beroperasi.</span>
                </div>

                <div v-if="mode === 'client'" role="alert" class="alert alert-warning alert-soft text-sm py-2.5">
                    <AlertTriangle class="size-4 shrink-0" />
                    <span class="text-yellow-500">Pastikan kasir utama sudah menyala dan terhubung ke <strong>WiFi yang sama.</strong></span>
                </div>

                <!-- Master: port config -->
                <div v-if="mode === 'master'" class="card card-border border-2">
                    <div class="card-body py-4 px-4 flex-row items-center gap-4">
                        <div class="flex-1">
                            <p class="font-semibold text-sm">Port Server</p>
                            <p class="text-xs text-base-content/50 mt-0.5">Nomor yang dipakai kasir tambahan untuk terhubung. Biarkan <strong>3001</strong> jika tidak yakin.</p>
                        </div>
                        <fieldset class="fieldset p-0 w-28 shrink-0">
                            <input
                                v-model="port"
                                type="number"
                                placeholder="3001"
                                class="input input-bordered w-full text-center"
                            />
                        </fieldset>
                    </div>
                </div>

                <!-- Client: discovery -->
                <div v-if="mode === 'client'" class="flex flex-col gap-3">

                    <div class="flex items-center justify-between">
                        <div>
                            <p class="font-semibold text-sm">Cari Kasir Utama</p>
                            <p class="text-xs text-base-content/50">Kasir utama aktif di jaringan WiFi Anda</p>
                        </div>
                        <button class="btn btn-sm btn-ghost" :disabled="scanning" @click="startScan">
                            <span v-if="scanning" class="loading loading-spinner loading-xs"></span>
                            <RefreshCw v-else class="size-4" />
                            Cari Ulang
                        </button>
                    </div>

                    <!-- Scanning -->
                    <div v-if="scanning && masters.length === 0" class="flex flex-col items-center gap-2 py-8">
                        <span class="loading loading-dots loading-md text-primary"></span>
                        <p class="text-sm text-base-content/60">Sedang mencari kasir utama...</p>
                    </div>

                    <!-- Empty -->
                    <div v-if="!scanning && masters.length === 0" role="alert" class="alert">
                        <WifiOff class="size-5 text-base-content/40" />
                        <div>
                            <p class="font-semibold text-sm">Tidak ada kasir utama ditemukan</p>
                            <p class="text-xs text-base-content/50">Nyalakan kasir utama lalu klik "Cari Ulang"</p>
                        </div>
                    </div>

                    <!-- Master list -->
                    <div v-if="masters.length > 0" class="flex flex-col gap-2">
                        <p class="text-xs text-base-content/50 font-medium">Pilih kasir utama yang ingin dihubungkan:</p>
                        <label
                            v-for="m in masters"
                            :key="m.ip + m.port"
                            class="card card-border border-2 cursor-pointer transition-colors has-checked:border-primary has-checked:bg-primary/5"
                        >
                            <div class="card-body flex-row items-center gap-3 py-3 px-4">
                                <input type="radio" name="master" class="radio radio-primary radio-sm" :value="m" v-model="selectedMaster" />
                                <div class="flex-1">
                                    <p class="font-semibold text-sm">{{ m.name }}</p>
                                    <p class="text-xs text-base-content/50">{{ m.ip }} · Port {{ m.port }}</p>
                                </div>
                                <div class="badge badge-success badge-soft gap-1.5">
                                    <span class="size-1.5 rounded-full bg-success inline-block"></span>
                                    Online
                                </div>
                            </div>
                        </label>
                    </div>

                </div>

                <!-- Error -->
                <div v-if="error" role="alert" class="alert alert-error">
                    <AlertCircle class="size-4 shrink-0" />
                    <span class="text-sm">{{ error }}</span>
                </div>

                <!-- Submit -->
                <button class="btn btn-primary w-full" :disabled="!bisa || loading" @click="simpan">
                    <span v-if="loading" class="loading loading-spinner loading-sm"></span>
                    {{ loading ? 'Menyimpan...' : 'Simpan & Lanjutkan' }}
                </button>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Server, Monitor, Info, AlertTriangle, AlertCircle, RefreshCw, WifiOff } from 'lucide-vue-next'

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
        error.value = 'Gagal menyimpan konfigurasi. Coba lagi.'
    } finally {
        loading.value = false
    }
}

onUnmounted(() => {
    window.api.discovery.stopScan()
    window.api.discovery.offFound()
})
</script>
