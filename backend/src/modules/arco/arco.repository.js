const User = require('../../models/user.model')
const Session = require('../../models/session.model')

// Criterio 1 — Obtener todos los datos del usuario
const getUserData = async (userId) => {
  return await User.findOne({
    where: { id: userId },
    attributes: [
      'id', 'nombre', 'apellido', 'correo', 'rol',
      'avatar_url', 'descripcion', 'acepta_privacidad',
      'fecha_aceptacion', 'status', 'created_at', 'last_login'
    ],
  })
}

// Criterio 2 — Actualizar datos del usuario
const updateUserData = async (userId, { nombre, apellido, descripcion, avatar_url }) => {
  const [updated] = await User.update(
    { nombre, apellido, descripcion, avatar_url },
    { where: { id: userId } }
  )
  return updated
}

// Criterio 3 — Bloquear cuenta temporalmente
const blockUser = async (userId) => {
  await User.update(
    { status: 'cancelled', blocked_at: new Date() },
    { where: { id: userId } }
  )
}

// Criterio 4 — Anonimizar cuenta después del periodo de gracia
const anonymizeUser = async (userId) => {
  await User.update(
    {
      nombre: 'Usuario',
      apellido: 'Eliminado',
      correo: `deleted_${userId}@nexora.deleted`,
      password: 'DELETED',
      avatar_url: null,
      descripcion: null,
      deleted_at: new Date(),
    },
    { where: { id: userId } }
  )

  // Eliminar sesiones del usuario
  await Session.destroy({ where: { user_id: userId } })
}

// Criterio 5 — Oposición al uso de datos secundarios
const updateDataOpposition = async (userId, opone) => {
  await User.update(
    { opone_uso_secundario: opone },
    { where: { id: userId } }
  )
}

// Verificar si el usuario ya está en periodo de gracia
const getUserStatus = async (userId) => {
  return await User.findOne({
    where: { id: userId },
    attributes: ['id', 'status', 'blocked_at'],
  })
}

module.exports = {
  getUserData,
  updateUserData,
  blockUser,
  anonymizeUser,
  updateDataOpposition,
  getUserStatus,
}