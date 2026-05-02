import { Router } from 'express'
import ProdukController from '../controllers/ProdukController'

const router = Router()

router.get('/',      ProdukController.index)
router.post('/',     ProdukController.store)
router.put('/:id',   ProdukController.update)
router.delete('/:id',ProdukController.destroy)

export default router
