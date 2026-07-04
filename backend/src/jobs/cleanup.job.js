
const { getPool } = require('../config/db.mysql')
const mongoose = require('mongoose')
const { getPolicy } = require('../config/dataPolicy')

const cleanExpiredSessions = async () => {
  try {
    const pool = getPool()
    const result = await pool.query(
      `DELETE FROM sessions WHERE expires_at < NOW() RETURNING id`
    )
    console.log(`[Cleanup] Sesiones expiradas eliminadas: ${result.rowCount}`)
  } catch (err) {
    console.error('[Cleanup] Error eliminando sesiones expiradas:', err.message)
  }
}

const cleanOldMessages = async () => {
  try {
    const policy = getPolicy('messages')
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - policy.retentionDays)

    const MessageModel = mongoose.model('Message')
    const result = await MessageModel.updateMany(
      {
        created_at: { $lt: cutoffDate },
        anonimizado: { $ne: true },
      },
      {
        $set: {
          contenido: '[Mensaje eliminado por política de retención]',
          anonimizado: true,
        },
      }
    )

    console.log(`[Cleanup] Mensajes anonimizados: ${result.modifiedCount}`)
  } catch (err) {
    console.error('[Cleanup] Error anonimizando mensajes:', err.message)
  }
}

const cleanCancelledAccounts = async () => {
  try {
    const pool = getPool()

    const result = await pool.query(
      `UPDATE users 
       SET 
         nombre = 'Usuario',
         apellido = 'Eliminado',
         correo = CONCAT('deleted_', id, '@nexora.deleted'),
         password = 'DELETED',
         avatar_url = NULL,
         descripcion = NULL,
         deleted_at = NOW()
       WHERE 
         status = 'cancelled' 
         AND blocked_at < NOW() - INTERVAL '30 days'
         AND deleted_at IS NULL
       RETURNING id`
    )

    console.log(`[Cleanup] Cuentas canceladas anonimizadas: ${result.rowCount}`)
  } catch (err) {
    console.error('[Cleanup] Error anonimizando cuentas canceladas:', err.message)
  }
}

const markInactiveUsers = async () => {
  try {
    const policy = getPolicy('users')
    const pool = getPool()

    const result = await pool.query(
      `UPDATE users
       SET status = 'inactive'
       WHERE 
         last_login < NOW() - INTERVAL '${policy.retentionDays} days'
         AND status = 'active'
       RETURNING id`
    )

    console.log(`[Cleanup] Usuarios marcados como inactivos: ${result.rowCount}`)
  } catch (err) {
    console.error('[Cleanup] Error marcando usuarios inactivos:', err.message)
  }
}

const runCleanupJobs = async () => {
  console.log('[Cleanup] Iniciando jobs de limpieza...')
  await cleanExpiredSessions()
  await cleanOldMessages()
  await cleanCancelledAccounts()
  await markInactiveUsers()
  console.log('[Cleanup] Jobs de limpieza completados')
}

module.exports = { runCleanupJobs }