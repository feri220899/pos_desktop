import { createRouter, createWebHashHistory } from 'vue-router'
import Setup      from '../views/Setup.vue'
import Aktivasi   from '../views/Aktivasi.vue'
import Dashboard  from '../views/Dashboard.vue'
import Produk     from '../views/Produk.vue'
import LisensiApi from '../services/LisensiApi'

const routes = [
    { path: '/',          redirect: '/aktivasi' },
    { path: '/setup',     component: Setup,     meta: { layout: false } },
    { path: '/aktivasi',  component: Aktivasi,  meta: { layout: false } },
    { path: '/dashboard', component: Dashboard, meta: { layout: true  } },
    { path: '/produk',    component: Produk,    meta: { layout: true  } },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

async function renewInBackground() {
    try {
        const key      = await window.api.config.get('license_key')
        const deviceId = await window.api.device.getId()
        if (!key) return
        const result = await LisensiApi.validasi(key, deviceId)
        if (result.token) {
            await window.api.config.set('license_token', result.token)
            await window.api.config.set('last_validated_at', Date.now())
        }
    } catch { /* server tidak bisa dihubungi, abaikan */ }
}

router.beforeEach(async (to) => {
    if (to.path === '/setup') return true

    const appMode = await window.api.config.get('app_mode')
    if (!appMode) return '/setup'

    if (to.path === '/aktivasi') return true

    const token = await window.api.config.get('license_token')
    if (!token) return '/aktivasi'

    const verify = await window.api.lisensi.verifyToken(token)
    
    if (verify.valid) {
        if (verify.daysLeft < 2) renewInBackground()
        return true
    }

    if (verify.expired) {
        // JWT expired — coba renewal dulu, kalau gagal beri grace 3 hari
        const lastValidated = await window.api.config.get('last_validated_at')
        if (lastValidated) {
            const hariSejak = (Date.now() - lastValidated) / 86400000
            if (hariSejak < 3) {
                renewInBackground()
                return true
            }
        }
    }
    
    return '/aktivasi'
})

export default router
