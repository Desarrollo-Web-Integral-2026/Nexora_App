const jwt =     require('jsonwebtoken');
const { error} = require('../utils/response.js');

// Verifica que el token JWT sea valido
const verifyToken = (req, res, next) => {
    try{
        const authHeader = req.headers['authorization']

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return error(res, 'Token de acceso requerido', 401)
        }

        const token = authHeader.split(' ')[1]

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return error(res, 'Token Expirado', 401)
        }
        return error(res, 'Token Invalido', 401)
    }
}

// Verifica que el usuario tenga el rol requerido
const verifyRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return error(res, 'No autenticado', 401)
        }

        if (!roles.includes(req.user.rol)) {
            return error(res, 'No tienes permisos para acceder a este recurso', 403)
        }

        next()
    }
} 

module.exports = { verifyToken, verifyRole }