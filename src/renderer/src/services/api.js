import axios from 'axios'

let client = null

async function getClient() {
    if (client) return client

    const mode = await window.api.config.get('app_mode')
    const port = await window.api.config.get('server_port') ?? 3001

    const baseURL = mode === 'master'
        ? `http://localhost:${port}`
        : `http://${await window.api.config.get('master_ip')}:${await window.api.config.get('master_port') ?? 3001}`

    const token = localStorage.getItem('auth_token')

    client = axios.create({
        baseURL,
        timeout: 10000,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    })

    client.interceptors.response.use(
        res => res,
        err => {
            if (err.response?.status === 401) {
                localStorage.removeItem('auth_token')
                localStorage.removeItem('auth_user')
                client = null
                window.location.hash = '/login'
            }
            return Promise.reject(err)
        }
    )

    return client
}

function reset() { client = null }

export default {
    get:    async (url, config)       => (await getClient()).get(url, config),
    post:   async (url, data, config) => (await getClient()).post(url, data, config),
    put:    async (url, data, config) => (await getClient()).put(url, data, config),
    delete: async (url, config)       => (await getClient()).delete(url, config),
    reset,
}
