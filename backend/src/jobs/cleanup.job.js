const { Op, literal } = require('sequelize')
const User = require('../models/user.model')
const Session = require('../models/session.model')
const { getPolicy } = require('../config/dataPolicy')
const { sequelize } = require('../config/db.mysql');


// Criterio 4 — Eliminar sesiones expiradas
const cleanExpiredSessions = async () => {
  try {
    const deleted = await Session.destroy({
      where: {
        expires_at: { [Op.lt]: new Date() },
      },
    })
    console.log(`[Cleanup] Sesiones expiradas eliminadas: ${deleted}`)
  } catch (err) {
    console.error('[Cleanup] Error eliminando sesiones expiradas:', err.message)
  }
}

// Criterio 3 — Eliminar cuentas que llevan más de 30 días bloqueadas
const cleanCancelledAccounts = async () => {
  try {
    const policy = getPolicy('users')
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - (process.env.GRACE_PERIOD_DAYS || 30))

    const [updated] = await User.update(
      {
        nombre: 'Usuario',
        apellido: 'Eliminado',
        correo: literal(`CONCAT('deleted_', id, '@nexora.deleted')`),
        password: 'DELETED',
        avatar_url: null,
        descripcion: null,
        deleted_at: new Date(),
      },
      {
        where: {
          status: 'cancelled',
          blocked_at: { [Op.lt]: cutoffDate },
          deleted_at: null,
        },
      }
    )

    console.log(`[Cleanup] Cuentas canceladas anonimizadas: ${updated}`)
  } catch (err) {
    console.error('[Cleanup] Error anonimizando cuentas canceladas:', err.message)
  }
}

// Criterio 2 — Marcar usuarios inactivos
const markInactiveUsers = async () => {
  try {
    const policy = getPolicy('users')
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - policy.retentionDays)

    const [updated] = await User.update(
      { status: 'inactive' },
      {
        where: {
          last_login: { [Op.lt]: cutoffDate },
          status: 'active',
        },
      }
    )

    console.log(`[Cleanup] Usuarios marcados como inactivos: ${updated}`)
  } catch (err) {
    console.error('[Cleanup] Error marcando usuarios inactivos:', err.message)
  }
}

// Ejecutar todos los jobs
const runCleanupJobs = async () => {
  console.log('[Cleanup] Iniciando jobs de limpieza...')
  await cleanExpiredSessions()
  await cleanCancelledAccounts()
  await markInactiveUsers()
  console.log('[Cleanup] Jobs de limpieza completados')
}

module.exports = { runCleanupJobs }