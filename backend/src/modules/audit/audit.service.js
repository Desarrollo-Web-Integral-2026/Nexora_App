const AuditLog = require('../../models/auditLog.model')
const { Op } = require('sequelize')

// Criterio 1 — Registrar log
const log = async ({
  userId = null,
  accion,
  entidad = null,
  entidadId = null,
  endpoint = null,
  metodo = null,
  ip = null,
  servicioExterno = null,
  tipoOperacion = null,
  exitoso = true,
  detalle = null,
}) => {
  try {
    await AuditLog.create({
      user_id: userId,
      accion,
      entidad,
      entidad_id: entidadId,
      endpoint,
      metodo,
      ip,
      servicio_externo: servicioExterno,
      tipo_operacion: tipoOperacion,
      exitoso,
      detalle,
    })
  } catch (err) {
    // El log nunca debe tumbar el sistema
    console.error('[AuditLog] Error registrando log:', err.message)
  }
}

// Criterio 7 — Detectar patrones sospechosos
const checkSuspiciousActivity = async (ip) => {
  try {
    const fifteenMinutesAgo = new Date()
    fifteenMinutesAgo.setMinutes(fifteenMinutesAgo.getMinutes() - 15)

    const failedAttempts = await AuditLog.count({
      where: {
        accion: 'LOGIN_FAILED',
        ip,
        created_at: { [Op.gte]: fifteenMinutesAgo },
      },
    })

    if (failedAttempts >= 5) {
      console.warn(`[AuditLog] ALERTA: ${failedAttempts} intentos fallidos desde IP ${ip} en los últimos 15 minutos`)
      return true
    }

    return false
  } catch (err) {
    console.error('[AuditLog] Error verificando actividad sospechosa:', err.message)
    return false
  }
}

// Criterio 4 — Obtener logs ARCO de un usuario
const getArcoLogs = async (userId) => {
  return await AuditLog.findAll({
    where: {
      user_id: userId,
      accion: {
        [Op.in]: [
          'ARCO_ACCESS',
          'ARCO_RECTIFICATION',
          'ARCO_CANCELLATION',
          'ARCO_OPPOSITION',
        ],
      },
    },
    order: [['created_at', 'DESC']],
  })
}

module.exports = { log, checkSuspiciousActivity, getArcoLogs }