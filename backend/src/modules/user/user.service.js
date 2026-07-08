const repo = require('./user.repository')
const mediaService = require('../media/media.service')

const getProfile = async (userId) => {
  const profile = await repo.findProfileById(userId)

  if (!profile) {
    const err = new Error('Perfil no encontrado')
    err.status = 404
    throw err
  }

  return profile
}

// Criterio 3 — el correo se ignora aunque venga en el body, ni siquiera se lee
const updateProfile = async (userId, { nombre, apellido, descripcion }) => {
  const updated = await repo.updateProfile(userId, { nombre, apellido, descripcion })

  if (!updated) {
    const err = new Error('Perfil no encontrado')
    err.status = 404
    throw err
  }

  return updated
}

// Criterio 4, 5, 6 — sube a Cloudinary vía media.service (ya valida consentimiento
// de privacidad y registra auditoría) y guarda solo la URL resultante
const updateAvatar = async (userId, fileBuffer) => {
  const { url } = await mediaService.upload(userId, fileBuffer, 'nexora/avatars')
  return await repo.updateAvatarUrl(userId, url)
}

module.exports = { getProfile, updateProfile, updateAvatar }