import express from 'express'
import ConfigService from './ConfigService'

const app = express()
let server = null

app.use(express.json())

app.get('/ping', (_, res) => res.json({ ok: true }))

function start() {
    const port = ConfigService.get('server_port') ?? 3001
    return new Promise((resolve, reject) => {
        server = app.listen(port, '0.0.0.0', () => {
            console.log(`[server] listening on port ${port}`)
            resolve(port)
        })
        server.on('error', reject)
    })
}

function stop() {
    return new Promise((resolve) => {
        if (!server) return resolve()
        server.close(resolve)
        server = null
    })
}

export { app }
export default { start, stop }
