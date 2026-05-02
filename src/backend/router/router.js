import Route            from '../config/Route'
import auth             from '../middleware/auth'
import can              from '../middleware/can'
import AuthController   from '../controllers/AuthController'
import ProdukController from '../controllers/ProdukController'

Route.group('/api/auth', [], (router) => {
    router.post('/login', AuthController.login)
    router.get('/me',     auth, AuthController.me)
})

Route.group('/api/produk', [auth, can('produk')], (router) => {
    router.get('/',       ProdukController.index)
    router.post('/',      ProdukController.store)
    router.put('/:id',    ProdukController.update)
    router.delete('/:id', ProdukController.destroy)
})
