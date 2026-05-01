import axios from 'axios'

const client = axios.create({
    baseURL: 'http://lisansi.test/api',
    timeout: 10000,
})

async function request(endpoint, body) {
    const { data } = await client.post(endpoint, body)
    return data
}

export default {
    aktivasi:   (key, deviceId) => request('/lisensi/aktivasi',   { license_key: key, device_id: deviceId }),
    validasi:   (key, deviceId) => request('/lisensi/validasi',   { license_key: key, device_id: deviceId }),
    deaktivasi: (key, deviceId) => request('/lisensi/deaktivasi', { license_key: key, device_id: deviceId }),
}
