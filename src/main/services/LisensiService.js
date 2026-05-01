import axios from 'axios'
import jwt from 'jsonwebtoken'

const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvGDG8GdB6J63/23CEFuV
KL6Y0GFpBx1DC6RyVmyaY8jiJCRymKOk0QjwoGuubQw2izu2zb6lc5uj4XibrSB6
l2QDrcx7gZ3Hj+QOUBtCwTrCO8FaGCHHJH28qtwvqCzsXvLxC6qacEMEikLt11EW
pK8PlnvYPwZrSCf/GtZfH3a+T/Z2YmbAgePLXUzlmAmzWAK8jvLjQaqQMCPAMUr9
mHnzrKyVqh9Gi8Iy41RUWlUGlrfJoY0oz6X3QBzr6jspuRS/dg2KIPTqlpAPwFt1
CvqY3QJ4nn6j7s7GwT/mQJ6s4oKX1+OW679O10UkyUP2uebaYhTRS4dgQE79u0uC
ZQIDAQAB
-----END PUBLIC KEY-----`

const client = axios.create({
    baseURL: 'http://lisansi.test/api',
    timeout: 10000,
})

async function request(endpoint, body) {
    const { data } = await client.post(endpoint, body)
    return data
}

function verifyToken(token) {
    try {
        const payload  = jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] })
        const daysLeft = (payload.exp * 1000 - Date.now()) / 86400000

        if (payload.expired_at && Date.now() / 1000 > payload.expired_at) {
            return { valid: false, expired: true, daysLeft: 0 }
        }

        return { valid: true, expired: false, daysLeft, payload }
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return { valid: false, expired: true, daysLeft: 0 }
        }
        return { valid: false, expired: false, daysLeft: 0 }
    }
}

export default {
    aktivasi:    (key, deviceId) => request('/lisensi/aktivasi',   { license_key: key, device_id: deviceId }),
    validasi:    (key, deviceId) => request('/lisensi/validasi',   { license_key: key, device_id: deviceId }),
    deaktivasi:  (key, deviceId) => request('/lisensi/deaktivasi', { license_key: key, device_id: deviceId }),
    verifyToken,
}
