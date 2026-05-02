import { app, BrowserWindow, ipcMain, Menu, shell } from 'electron'
import { join } from 'path'
import routes from './routes'
import ConfigService from './services/ConfigService'
import DiscoveryService from './services/DiscoveryService'
import ServerService from './services/ServerService'

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 800,
        minWidth: 1024,
        minHeight: 600,
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
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

app.whenReady().then(() => {
    routes.forEach(({ channel, handler }) => {
        ipcMain.handle(channel, (_, ...args) => handler(...args))
    })
    ipcMain.handle('shell:openExternal', (_, url) => shell.openExternal(url))

    ipcMain.on('discovery:advertise', () => DiscoveryService.advertise())
    ipcMain.on('discovery:scan', (event) => {
        DiscoveryService.scan((master) => {
            event.sender.send('discovery:found', master)
        })
    })
    ipcMain.on('discovery:stopScan', () => DiscoveryService.stopScan())

    createWindow()

    ipcMain.on('server:start', () => ServerService.start())

    const appMode = ConfigService.get('app_mode')
    if (appMode === 'master') {
        ServerService.start()
        DiscoveryService.advertise()
    }
})

app.on('before-quit', () => {
    DiscoveryService.destroy()
    ServerService.stop()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
