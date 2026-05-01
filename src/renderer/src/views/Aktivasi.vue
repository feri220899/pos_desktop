<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router     = useRouter()
const licenseKey = ref('')
const error      = ref('')
const loading    = ref(false)

function bukaTrial() {
    window.api.openBrowser('https://lisansi.test')
}

onMounted(async () => {
    const savedKey = await window.api.config.get('license_key')
    const deviceId = await window.api.device.getId()

    if (savedKey) {
        const result = await window.api.lisensi.validasi(savedKey, deviceId)
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
    if (!licenseKey.value.trim()) return
    loading.value = true
    error.value   = ''

    const deviceId = await window.api.device.getId()
    const result   = await window.api.lisensi.aktivasi(licenseKey.value.trim(), deviceId)

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

<template>
    <div class="min-h-screen flex items-center justify-center bg-base-200">
        <div class="card w-96 bg-base-100 shadow-xl">
            <div class="card-body items-center text-center gap-4">
                <h2 class="card-title text-2xl">POS Desktop</h2>
                <p class="text-base-content/60 text-sm">Masukkan license key untuk mengaktifkan aplikasi</p>

                <div v-if="error" class="alert alert-error w-full py-2">
                    <span class="text-sm">{{ error }}</span>
                </div>

                <input v-model="licenseKey" type="text" placeholder="XXXXX-XXXXX-XXXXX-XXXXX"
                    class="input input-bordered w-full text-center tracking-widest" maxlength="23"
                    @keyup.enter="aktivasi" />

                <button @click="aktivasi" class="btn btn-primary w-full" :disabled="loading">
                    <span v-if="loading" class="loading loading-spinner loading-sm"></span>
                    {{ loading ? 'Memproses...' : 'Aktivasi' }}
                </button>

                <div class="divider text-xs text-base-content/40 my-0">atau</div>

                <button @click="bukaTrial" class="btn btn-ghost btn-sm w-full">
                    Coba Gratis 7 Hari
                </button>
            </div>
        </div>
    </div>
</template>
