<template>
    <div class="flex h-screen">

        <!-- Left Panel -->
        <div data-theme="night" class="hidden lg:flex max-w-2/6 bg-base-100 flex-col justify-between p-10 relative overflow-hidden">

            <!-- Decorative circles -->
            <div class="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-primary/10 pointer-events-none"></div>
            <div class="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-primary/5 pointer-events-none"></div>

            <!-- Logo -->
            <div class="relative z-10 flex items-center gap-3">
                <div class="btn btn-primary btn-square btn-sm no-animation pointer-events-none">
                    <LayoutGrid class="size-4" />
                </div>
                <span class="font-bold text-base-content">POS Desktop</span>
            </div>

            <!-- Center content -->
            <div class="relative z-10">
                <h1 class="text-3xl font-bold text-base-content leading-tight mb-4">
                    Satu lisensi,<br/>siap digunakan
                </h1>
                <p class="text-base-content/50 text-sm leading-relaxed mb-8">
                    Aktifkan aplikasi dengan license key yang Anda terima setelah pembelian.
                </p>
                <div class="space-y-3">
                    <div v-for="item in info" :key="item" class="flex items-center gap-3">
                        <div class="size-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                            <Check class="size-3 text-primary" />
                        </div>
                        <span class="text-sm text-base-content/60">{{ item }}</span>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="relative z-10 text-xs text-base-content/20">
                &copy; {{ year }} POS Desktop
            </div>
        </div>

        <!-- Right Panel -->
        <div class="flex-1 flex items-center justify-center bg-base-200 p-6">
           <div class="w-full max-w-lg bg-base-100/30 p-8 rounded-2xl shadow-sm">

                <!-- Mobile logo -->
                <div class="lg:hidden flex items-center justify-center gap-2 mb-8">
                    <div class="btn btn-primary btn-square btn-sm no-animation pointer-events-none">
                        <LayoutGrid class="size-4" />
                    </div>
                    <span class="font-bold text-lg">POS Desktop</span>
                </div>

                <!-- Heading -->
                <div class="mb-7">
                    <h2 class="text-2xl font-bold text-base-content">Aktivasi Lisensi</h2>
                    <p class="text-base-content/50 text-sm mt-1">Masukkan license key untuk mulai menggunakan aplikasi</p>
                </div>

                <!-- Form -->
                <div class="space-y-4">

                    <div class="space-y-1.5">
                        <label class="text-sm font-medium text-base-content">License Key</label>
                        <label class="input input-bordered flex items-center gap-2 w-full" :class="{ 'input-error': error, 'input-disabled': loading }">
                            <KeyRound class="size-4 text-base-content/30 shrink-0" />
                            <input
                                v-model="licenseKey"
                                type="text"
                                placeholder="XXXXX-XXXXX-XXXXX-XXXXX"
                                class="grow tracking-widest font-mono text-sm uppercase"
                                maxlength="23"
                                :disabled="loading"
                                @keyup.enter="aktivasi"
                            />
                        </label>
                        <p class="text-sm mt-1" :class="error ? 'text-error' : 'validator text-base-content/40'">
                            {{ error || 'License key dikirim ke email setelah pembelian' }}
                        </p>
                    </div>

                    <button class="btn btn-primary w-full mt-2" :disabled="loading" @click="aktivasi">
                        <span v-if="loading" class="loading loading-spinner loading-sm"></span>
                        {{ loading ? 'Memproses...' : 'Aktifkan Sekarang' }}
                    </button>

                    <div class="divider text-xs text-base-content/40 my-2">Belum punya lisensi?</div>

                    <div class="grid grid-cols-2 gap-2">
                        <button class="btn btn-outline w-full gap-2" @click="bukaTrial">
                            <ExternalLink class="size-4" />
                            Coba Gratis 7 Hari
                        </button>
                        <button class="btn btn-ghost w-full gap-2" @click="bukaParket">
                            <PackageSearch class="size-4" />
                            Cek Lisensi Saya
                        </button>
                    </div>

                </div>

                <p class="text-center text-xs text-base-content/25 mt-10">v1.0.0</p>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { LayoutGrid, Check, KeyRound, ExternalLink, PackageSearch } from 'lucide-vue-next'
import LisensiApi from '../services/LisensiApi'

const router     = useRouter()
const licenseKey = ref('')
const error      = ref('')
const loading    = ref(false)
const year       = new Date().getFullYear()

const info = [
    'Aktivasi sekali, gunakan selamanya',
    'Mendukung multi kasir dalam satu jaringan',
    'Update aplikasi gratis',
]

function bukaTrial() {
    window.api.openBrowser('https://lisansi.test')
}

function bukaParket() {
    window.api.openBrowser('https://lisansi.test/paket-saya')
}

onMounted(async () => {
    const savedKey = await window.api.config.get('license_key')
    const deviceId = await window.api.device.getId()

    if (savedKey) {
        const result = await LisensiApi.validasi(savedKey, deviceId)
        if (result.valid) {
            if (result.token) {
                await window.api.config.set('license_token', result.token)
                await window.api.config.set('last_validated_at', Date.now())
            }
            router.replace('/dashboard')
        }
    }
})

async function aktivasi() {
    if (!licenseKey.value.trim()) {
        error.value = 'License key tidak boleh kosong.'
        return
    }
    loading.value = true
    error.value   = ''

    const deviceId = await window.api.device.getId()
    const result   = await LisensiApi.aktivasi(licenseKey.value.trim(), deviceId)

    if (result.success) {
        await window.api.config.set('license_key', licenseKey.value.trim())
        if (result.token) {
            await window.api.config.set('license_token', result.token)
            await window.api.config.set('last_validated_at', Date.now())
        }
        router.replace('/dashboard')
    } else {
        error.value = result.pesan || result.message || 'Aktivasi gagal.'
    }
    loading.value = false
}
</script>
