import axios from 'axios'

let client = null

async function getClient() {
    if (client) return client

    const mode = await window.api.config.get('app_mode')
    const port = await window.api.config.get('server_port') ?? 3001

    const baseURL = mode === 'master'
        ? `http://localhost:${port}`
        : `http://${await window.api.config.get('master_ip')}:${await window.api.config.get('master_port') ?? 3001}`

    client = axios.create({ baseURL, timeout: 10000 })
    return client
}

// Reset client (dipanggil jika config berubah)
function reset() { client = null }

export default {
    get:    async (url, config)       => (await getClient()).get(url, config),
    post:   async (url, data, config) => (await getClient()).post(url, data, config),
    put:    async (url, data, config) => (await getClient()).put(url, data, config),
    delete: async (url, config)       => (await getClient()).delete(url, config),
    reset,
}
