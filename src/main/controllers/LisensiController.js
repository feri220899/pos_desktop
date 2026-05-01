import LisensiService from '../services/LisensiService'

async function aktivasi(key, deviceId) {
    if (!key || !deviceId) {
        return { success: false, message: 'License key dan device ID wajib diisi.' }
    }
    try {
        const data = await LisensiService.aktivasi(key, deviceId)
        return { success: true, ...data }
    } catch {
        return { success: false, message: 'Gagal terhubung ke server lisensi.' }
    }
}

async function validasi(key, deviceId) {
    if (!key || !deviceId) {
        return { valid: false, message: 'License key dan device ID wajib diisi.' }
    }
    try {
        return await LisensiService.validasi(key, deviceId)
    } catch {
        return { valid: false, message: 'Gagal terhubung ke server lisensi.' }
    }
}

async function deaktivasi(key, deviceId) {
    if (!key || !deviceId) {
        return { success: false, message: 'License key dan device ID wajib diisi.' }
    }
    try {
        const data = await LisensiService.deaktivasi(key, deviceId)
        return { success: true, ...data }
    } catch {
        return { success: false, message: 'Gagal terhubung ke server lisensi.' }
    }
}

export default { aktivasi, validasi, deaktivasi }
