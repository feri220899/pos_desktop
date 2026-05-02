import { createRouter, createWebHashHistory } from 'vue-router'
import Setup       from '../views/Setup.vue'
import Aktivasi    from '../views/Aktivasi.vue'
import Login       from '../views/Login.vue'
import Dashboard   from '../views/Dashboard.vue'
import Kasir       from '../views/Kasir.vue'
import Produk      from '../views/Produk.vue'
import Transaksi   from '../views/Transaksi.vue'
import Laporan     from '../views/Laporan.vue'
import Pengaturan  from '../views/Pengaturan.vue'
import LisensiApi  from '../services/LisensiApi'

const routes = [
    { path: '/',           redirect: '/aktivasi' },
    { path: '/setup',      component: Setup,      meta: { layout: false } },
    { path: '/aktivasi',   component: Aktivasi,   meta: { layout: false } },
    { path: '/login',      component: Login,      meta: { layout: false } },
    { path: '/dashboard',  component: Dashboard,  meta: { layout: true, auth: true } },
    { path: '/kasir',      component: Kasir,      meta: { layout: true, auth: true, permission: 'kasir'      } },
    { path: '/produk',     component: Produk,     meta: { layout: true, auth: true, permission: 'produk'     } },
    { path: '/transaksi',  component: Transaksi,  meta: { layout: true, auth: true, permission: 'transaksi'  } },
    { path: '/laporan',    component: Laporan,    meta: { layout: true, auth: true, permission: 'laporan'    } },
    { path: '/pengaturan', component: Pengaturan, meta: { layout: true, auth: true } },
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
    } catch {}
}

router.beforeEach(async (to) => {
    if (to.path === '/setup') return true

    const appMode = await window.api.config.get('app_mode')
    if (!appMode) return '/setup'

    if (to.path === '/aktivasi' || to.path === '/login') return true

    const licenseToken = await window.api.config.get('license_token')
    if (!licenseToken) return '/aktivasi'

    const verify = await window.api.lisensi.verifyToken(licenseToken)

    if (verify.valid) {
        if (verify.daysLeft < 2) renewInBackground()
    } else if (verify.expired) {
        const lastValidated = await window.api.config.get('last_validated_at')
        if (lastValidated && (Date.now() - lastValidated) / 86400000 < 3) {
            renewInBackground()
        } else {
            return '/aktivasi'
        }
    } else {
        return '/aktivasi'
    }

    if (!to.meta.auth) return true

    const authToken = localStorage.getItem('auth_token')
    if (!authToken) return '/login'

    if (to.meta.permission) {
        const user = JSON.parse(localStorage.getItem('auth_user') || 'null')
        if (!user?.permissions?.includes(to.meta.permission)) return '/dashboard'
    }

    return true
})

export default router
