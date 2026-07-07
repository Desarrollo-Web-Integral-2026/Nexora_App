const auditService = require('../modules/audit/audit.service')

// Criterio 1 — Middleware que registra automáticamente accesos a endpoints
const auditLog = (accion, entidad = null) => {
  return async (req, res, next) => {
    const originalJson = res.json.bind(res)

    res.json = async (body) => {
      const exitoso = res.statusCode < 400

      await auditService.log({
        userId: req.user?.id || null,
        accion,
        entidad,
        endpoint: req.originalUrl,
        metodo: req.method,
        ip: req.ip || req.headers['x-forwarded-for'],
        exitoso,
      })

      return originalJson(body)
    }

    next()
  }
}

module.exports = { auditLog }