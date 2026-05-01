import { networkInterfaces, hostname } from 'os'
import { createHash } from 'crypto'

function getId() {
    const interfaces = networkInterfaces()
    let mac = ''

    for (const iface of Object.values(interfaces)) {
        for (const addr of iface) {
            if (!addr.internal && addr.mac && addr.mac !== '00:00:00:00:00:00') {
                mac = addr.mac
                break
            }
        }
        if (mac) break
    }

    return createHash('sha256').update(`${mac}-${hostname()}`).digest('hex')
}

export default { getId }
