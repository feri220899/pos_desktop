import Route            from '../config/Route'
import auth             from '../middleware/auth'
import ProdukController from '../controllers/ProdukController'

Route.group('/api/produk', [auth], (router) => {
    router.get('/',       ProdukController.index)
    router.post('/',      ProdukController.store)
    router.put('/:id',    ProdukController.update)
    router.delete('/:id', ProdukController.destroy)
})
