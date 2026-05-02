import { app, BrowserWindow, ipcMain, Menu, shell } from 'electron'
import { join } from 'path'
import LisensiService   from './electron/LisensiService'
import ConfigService    from './electron/ConfigService'
import DeviceService    from './electron/DeviceService'
import DiscoveryService from './electron/DiscoveryService'
import ServerService, { expressApp } from './electron/ServerService'
import DatabaseService               from '../backend/config/DatabaseService'
import registerRoutes                from '../backend/index.js'

registerRoutes(expressApp)

// ─── Window ──────────────────────────────────────────────────────────────────

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 800,
        minWidth: 1024,
        minHeight: 600,
        webPreferences: {
            preload: join(__dirname, '../preload/preload.js'),
        },
    })

    if (process.env.NODE_ENV === 'development') {
        win.loadURL(process.env.ELECTRON_RENDERER_URL)
        win.webContents.openDevTools()
    } else {
        Menu.setApplicationMenu(null)
        win.loadFile(join(__dirname, '../renderer/index.html'))
        win.webContents.on('before-input-event', (event, input) => {
            if (input.key === 'F12' || (input.control && input.shift && input.key === 'I')) {
                event.preventDefault()
            }
        })
    }
}

// ─── IPC + App ───────────────────────────────────────────────────────────────

app.whenReady().then(() => {

    // Lisensi — verifyToken saja, aktivasi/validasi langsung dari renderer ke Laravel
    ipcMain.handle('lisensi:verifyToken', (_, token)      => LisensiService.verifyToken(token))

    // Config lokal — dibutuhkan sebelum Express tersedia
    ipcMain.handle('config:get',          (_, key)        => ConfigService.get(key))
    ipcMain.handle('config:set',          (_, key, value) => ConfigService.set(key, value))

    // Device ID — untuk aktivasi lisensi
    ipcMain.handle('device:getId',        ()              => DeviceService.getId())

    // Shell — buka URL di browser default
    ipcMain.handle('shell:openExternal',  (_, url)        => shell.openExternal(url))

    // Discovery — pakai ipcMain.on karena butuh event.sender untuk push balik ke renderer
    ipcMain.on('discovery:advertise', ()      => DiscoveryService.advertise())
    ipcMain.on('discovery:stopScan',  ()      => DiscoveryService.stopScan())
    ipcMain.on('discovery:scan', (event) => {
        DiscoveryService.scan((master) => event.sender.send('discovery:found', master))
    })

    // Server — start on-demand dari setup screen
    ipcMain.on('server:start', () => ServerService.start())

    createWindow()

    // Kalau sudah pernah setup sebagai master, langsung start server & broadcast
    const appMode = ConfigService.get('app_mode')
    if (appMode === 'master') {
        DatabaseService.connect()
        ServerService.start()
        DiscoveryService.advertise()
    }
})

// ─── Lifecycle ───────────────────────────────────────────────────────────────

app.on('before-quit', () => {
    DiscoveryService.destroy()
    ServerService.stop()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
