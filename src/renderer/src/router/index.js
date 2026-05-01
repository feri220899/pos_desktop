import { createRouter, createWebHashHistory } from 'vue-router'
import Aktivasi  from '../views/Aktivasi.vue'
import Dashboard from '../views/Dashboard.vue'
import Produk    from '../views/Produk.vue'

const routes = [
    { path: '/',          redirect: '/aktivasi' },
    { path: '/aktivasi',  component: Aktivasi,  meta: { layout: false } },
    { path: '/dashboard', component: Dashboard, meta: { layout: true  } },
    { path: '/produk',    component: Produk,    meta: { layout: true  } },
]

export default createRouter({
    history: createWebHashHistory(),
    routes,
})
