import ConfigService from '../services/ConfigService'

export default {
    get: (key)        => ConfigService.get(key),
    set: (key, value) => ConfigService.set(key, value),
}
