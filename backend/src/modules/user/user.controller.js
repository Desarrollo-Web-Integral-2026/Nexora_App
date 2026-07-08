const userService = require('./user.service')
const { success, error } = require('../../utils/response.js')

// Criterio 1, 7 — GET /profile requiere JWT (verifyToken ya corrió antes en la ruta)
const getProfile = async (req, res) => {
  try {
    const profile = await userService.getProfile(req.user.id)
    return success(res, profile, 'Perfil obtenido correctamente')
  } catch (err) {
    return error(res, err.message, err.status || 500)
  }
}

// Criterio 2, 3, 8, 9 — PUT /profile actualiza nombre/apellido/descripcion
const updateProfile = async (req, res) => {
  try {
    const { nombre, apellido, descripcion } = req.body
    // Criterio 3 — el correo se descarta explícitamente aunque venga en el body
    const updated = await userService.updateProfile(req.user.id, { nombre, apellido, descripcion })
    return success(res, updated, 'Perfil actualizado correctamente', 200)
  } catch (err) {
    return error(res, err.message, err.status || 500)
  }
}

// Criterio 4, 5, 6 — PUT /avatar recibe multipart/form-data (req.file via multer)
const updateAvatar = async (req, res) => {
  try {
    const updated = await userService.updateAvatar(req.user.id, req.file.buffer)
    return success(res, updated, 'Avatar actualizado correctamente', 200)
  } catch (err) {
    return error(res, err.message, err.status || 500)
  }
}

module.exports = { getProfile, updateProfile, updateAvatar }