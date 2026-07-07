const arcoService = require('./arco.service')
const { success, error } = require('../../utils/response')

// Criterio 1 — Acceso
const getMyData = async (req, res) => {
  try {
    const data = await arcoService.getUserData(req.user.id)
    return success(res, data, 'Datos personales obtenidos correctamente')
  } catch (err) {
    return error(res, err.message, err.status || 500)
  }
}

// Criterio 2 — Rectificación
const updateMyData = async (req, res) => {
  try {
    const { nombre, apellido, descripcion, avatar_url } = req.body
    await arcoService.updateUserData(req.user.id, { nombre, apellido, descripcion, avatar_url })
    return success(res, null, 'Información actualizada correctamente')
  } catch (err) {
    return error(res, err.message, err.status || 500)
  }
}

// Criterio 3 y 7 — Cancelación con periodo de gracia
const cancelMyAccount = async (req, res) => {
  try {
    const result = await arcoService.cancelAccount(req.user.id)
    return success(res, result, result.message)
  } catch (err) {
    return error(res, err.message, err.status || 500)
  }
}

// Criterio 5 — Oposición
const opposeDataUsage = async (req, res) => {
  try {
    const { opone } = req.body

    if (typeof opone !== 'boolean') {
      return error(res, 'El campo opone debe ser true o false', 400)
    }

    const result = await arcoService.opposeDataUsage(req.user.id, opone)
    return success(res, null, result.message)
  } catch (err) {
    return error(res, err.message, err.status || 500)
  }
}

module.exports = {
  getMyData,
  updateMyData,
  cancelMyAccount,
  opposeDataUsage,
}