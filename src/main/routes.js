import LisensiController from './controllers/LisensiController'
import ConfigController  from './controllers/ConfigController'
import DeviceController  from './controllers/DeviceController'

export default [
    { channel: 'lisensi:aktivasi',   handler: LisensiController.aktivasi   },
    { channel: 'lisensi:validasi',   handler: LisensiController.validasi   },
    { channel: 'lisensi:deaktivasi', handler: LisensiController.deaktivasi },

    { channel: 'config:get', handler: ConfigController.get },
    { channel: 'config:set', handler: ConfigController.set },

    { channel: 'device:getId', handler: DeviceController.getId },
]
