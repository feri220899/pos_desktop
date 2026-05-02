import jwt     from 'jsonwebtoken'
import bcrypt   from 'bcryptjs'
import User     from '../models/User'
import Response from '../helpers/response'
import { JWT_SECRET } from '../config/constants'

function login(req, res) {
    try {
        const { username, password } = req.body

        if (!username || !password)
            return Response.badRequest(res, 'Username dan password wajib diisi')

        const user = User.findByUsername(username)

        if (!user || !user.active)
            return Response.badRequest(res, 'Username atau password salah')

        const hash = User.getPasswordHash(user.id)

        if (!bcrypt.compareSync(password, hash))
            return Response.badRequest(res, 'Username atau password salah')

        const payload = {
            id:          user.id,
            username:    user.username,
            role:        user.role_name,
            permissions: user.permissions,
        }

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' })

        Response.success(res, { token, user: payload })
    } catch {
        Response.serverError(res)
    }
}

function me(req, res) {
    Response.success(res, req.user)
}

export default { login, me }
