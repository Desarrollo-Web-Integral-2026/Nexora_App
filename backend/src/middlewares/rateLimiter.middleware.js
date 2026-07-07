const { rateLimit, ipKeyGenerator } = require('express-rate-limit')

/** Criterio 8 - Rate Limiting especifico en /login
 *  5 intentos por IP cada 15 minutos. No cuentas los intentos exitosos
 *  Solo los fallidos, para no bloquear a un usuario.
 */

const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    message: {
        success: false,
        message: 'Demasiados intentos de inicio de sesión. Intenta de nuevo en 15 minutos.',
    },
    handler: (req, res, _next, options) => {
        res.status(options.statusCode).json(options.message)
    },
    keyGenerator: (req) => ipKeyGenerator(req.ip),
})

module.exports = { loginRateLimiter }