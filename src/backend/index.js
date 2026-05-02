import { mainRouter } from './config/Route'
import './router/router'

export default function registerRoutes(app) {
    app.use(mainRouter)
}
