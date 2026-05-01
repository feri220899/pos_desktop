import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
    lisensi: {
        aktivasi:    (key, deviceId) => ipcRenderer.invoke('lisensi:aktivasi',    key, deviceId),
        validasi:    (key, deviceId) => ipcRenderer.invoke('lisensi:validasi',    key, deviceId),
        deaktivasi:  (key, deviceId) => ipcRenderer.invoke('lisensi:deaktivasi',  key, deviceId),
        verifyToken: (token)         => ipcRenderer.invoke('lisensi:verifyToken', token),
    },
    config: {
        get: (key)        => ipcRenderer.invoke('config:get', key),
        set: (key, value) => ipcRenderer.invoke('config:set', key, value),
    },
    device: {
        getId: () => ipcRenderer.invoke('device:getId'),
    },
})
