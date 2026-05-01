import { app, BrowserWindow, ipcMain, Menu } from 'electron'
import { join } from 'path'
import routes from './routes'

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
    createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
