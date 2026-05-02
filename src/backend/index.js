import { app } from '../main/electron/ServerService'
import produkRoutes from './routes/produk'

app.use('/api/produk', produkRoutes)
