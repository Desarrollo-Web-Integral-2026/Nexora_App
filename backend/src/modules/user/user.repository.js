const User = require('../../models/user.model')

// Criterio 1 — nunca exponer password ni campos sensibles de privacidad/ARCO
const PUBLIC_ATTRIBUTES = [
  'id', 'nombre', 'apellido', 'correo', 'rol',
  'avatar_url', 'descripcion', 'created_at',
]

const findProfileById = async (userId) => {
  return await User.findOne({
    where: { id: userId },
    attributes: PUBLIC_ATTRIBUTES,
  })
}

// Criterio 2, 3 — solo persiste los campos permitidos (nunca correo)
const updateProfile = async (userId, { nombre, apellido, descripcion }) => {
  const fieldsToUpdate = {}
  if (nombre !== undefined) fieldsToUpdate.nombre = nombre
  if (apellido !== undefined) fieldsToUpdate.apellido = apellido
  if (descripcion !== undefined) fieldsToUpdate.descripcion = descripcion

  await User.update(fieldsToUpdate, { where: { id: userId } })
  return await findProfileById(userId)
}

// Criterio 6 — solo se guarda la URL resultante de Cloudinary
const updateAvatarUrl = async (userId, avatarUrl) => {
  await User.update({ avatar_url: avatarUrl }, { where: { id: userId } })
  return await findProfileById(userId)
}

module.exports = { findProfileById, updateProfile, updateAvatarUrl, PUBLIC_ATTRIBUTES }