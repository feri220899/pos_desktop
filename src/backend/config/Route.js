import { Router } from 'express'

const mainRouter = Router()

const Route = {
    group(prefix, middlewares, callback) {
        const router = Router()
        if (middlewares.length) router.use(...middlewares)
        callback(router)
        mainRouter.use(prefix, router)
    },
    use(...args) { mainRouter.use(...args) },
}

export { mainRouter }
export default Route
