import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/constants'

export default function auth(req, res, next) {
    const header = req.headers.authorization

    if (!header?.startsWith('Bearer '))
        return res.status(401).json({ success: false, message: 'Unauthorized' })

    try {
        req.user = jwt.verify(header.slice(7), JWT_SECRET)
        next()
    } catch {
        return res.status(401).json({ success: false, message: 'Token tidak valid atau kadaluarsa' })
    }
}
