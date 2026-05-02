import { Bonjour } from 'bonjour-service'
import ConfigService from './ConfigService'

const bonjour  = new Bonjour()
let advertiser = null
let browser    = null

function advertise() {
    const port = ConfigService.get('server_port') ?? 3001
    advertiser = bonjour.publish({ name: 'POS Master', type: 'pos', port })
}

function stopAdvertise() {
    advertiser?.stop()
    advertiser = null
}

function scan(onFound) {
    browser = bonjour.find({ type: 'pos' }, (service) => {
        const ip   = service.addresses?.find(a => a.includes('.')) ?? service.host
        const port = service.port
        onFound({ name: service.name, ip, port })
    })
}

function stopScan() {
    browser?.stop()
    browser = null
}

function destroy() {
    stopAdvertise()
    stopScan()
    bonjour.destroy()
}

export default { advertise, stopAdvertise, scan, stopScan, destroy }
