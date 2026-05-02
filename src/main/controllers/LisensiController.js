import LisensiService from '../services/LisensiService'

async function aktivasi(key, deviceId) {
    if (!key || !deviceId) {
        return { success: false, message: 'License key dan device ID wajib diisi.' }
    }
    try {
        const data = await LisensiService.aktivasi(key, deviceId)
        return { success: true, ...data }
    } catch (error) {
        const resData = error.response?.data
        return { success: false, message: resData?.pesan ?? resData?.message ?? 'Gagal terhubung ke server lisensi.' }
    }
}

async function validasi(key, deviceId) {
    if (!key || !deviceId) {
        return { valid: false, message: 'License key dan device ID wajib diisi.' }
    }
    try {
        const data = await LisensiService.validasi(key, deviceId)
        return { success: true, ...data }
    } catch (error) {
        const resData = error.response?.data
        return { success: false, message: resData?.pesan ?? resData?.message ?? 'Gagal terhubung ke server lisensi.' }
    }
}

async function deaktivasi(key, deviceId) {
    if (!key || !deviceId) {
        return { success: false, message: 'License key dan device ID wajib diisi.' }
    }
    try {
        const data = await LisensiService.deaktivasi(key, deviceId)
        return { success: true, ...data }
    } catch (error) {
        const resData = error.response?.data
        return { success: false, message: resData?.pesan ?? resData?.message ?? 'Gagal terhubung ke server lisensi.' }
    }
}

function verifyToken(token) {    
    if (!token) return { valid: false, expired: false, daysLeft: 0 }
    return LisensiService.verifyToken(token)
}

export default { aktivasi, validasi, deaktivasi, verifyToken }
