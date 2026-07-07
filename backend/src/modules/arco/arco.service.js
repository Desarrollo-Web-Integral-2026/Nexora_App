const repo = require('./arco.repository')

const GRACE_PERIOD_DAYS = process.env.GRACE_PERIOD_DAYS || 30

// Criterio 1 — Acceso a datos personales
const getUserData = async (userId) => {
  const user = await repo.getUserData(userId)
  if (!user) {
    const err = new Error('Usuario no encontrado')
    err.status = 404
    throw err
  }
  return user
}

// Criterio 2 — Rectificación de datos
const updateUserData = async (userId, data) => {
  const updated = await repo.updateUserData(userId, data)
  if (!updated) {
    const err = new Error('No se pudo actualizar la información')
    err.status = 400
    throw err
  }
}

// Criterio 3 y 7 — Cancelación con periodo de gracia
const cancelAccount = async (userId) => {
  const user = await repo.getUserStatus(userId)

  if (!user) {
    const err = new Error('Usuario no encontrado')
    err.status = 404
    throw err
  }

  if (user.status === 'cancelled') {
    const err = new Error('La cuenta ya está en proceso de cancelación')
    err.status = 400
    throw err
  }

  // Bloquear temporalmente — criterio 3
  await repo.blockUser(userId)

  return {
    message: `Tu cuenta ha sido bloqueada. Será eliminada definitivamente en ${GRACE_PERIOD_DAYS} días.`,
    gracePeriodDays: GRACE_PERIOD_DAYS,
    deletionDate: new Date(Date.now() + GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000),
  }
}

// Criterio 4 — Anonimización definitiva (llamado por el cleanup job)
const anonymizeAccount = async (userId) => {
  const user = await repo.getUserStatus(userId)

  if (!user || user.status !== 'cancelled') {
    const err = new Error('La cuenta no está en proceso de cancelación')
    err.status = 400
    throw err
  }

  const blockedAt = new Date(user.blocked_at)
  const now = new Date()
  const daysDiff = Math.floor((now - blockedAt) / (1000 * 60 * 60 * 24))

  if (daysDiff < GRACE_PERIOD_DAYS) {
    const err = new Error(`El periodo de gracia aún no ha terminado. Faltan ${GRACE_PERIOD_DAYS - daysDiff} días.`)
    err.status = 400
    throw err
  }

  await repo.anonymizeUser(userId)
}

// Criterio 5 — Oposición
const opposeDataUsage = async (userId, opone) => {
  await repo.updateDataOpposition(userId, opone)
  return {
    message: opone
      ? 'Te has opuesto al uso de tus datos para fines secundarios'
      : 'Has retirado tu oposición al uso de tus datos para fines secundarios',
  }
}

module.exports = {
  getUserData,
  updateUserData,
  cancelAccount,
  anonymizeAccount,
  opposeDataUsage,
}