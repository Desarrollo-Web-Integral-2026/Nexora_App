const User = require('../../models/user.model')
const Session = require('../../models/session.model')
const PasswordReset = require('../../models/passwordReset.model')

// Criterio 10 — Sequelize usa parámetros, protege contra inyección SQL
const createUser = async ({ nombre, apellido, correo, password, rol, fechaAceptacion }) => {
  return await User.create({
    nombre: nombre.trim(),
    apellido: apellido.trim(),
    correo: correo.toLowerCase().trim(),
    password,
    rol,
    acepta_privacidad: true,
    fecha_aceptacion: fechaAceptacion,
    status: 'active',
  })
}

const findUserByEmail = async (correo) => {
  return await User.findOne({
    where: { correo: correo.toLowerCase().trim() },
  })
}

const findUserById = async (id) => {
  return await User.findOne({
    where: { id },
    attributes: { exclude: ['password'] },
  })
}

const findPasswordByUserId = async (userId) => {
  return await User.findOne({
    where: { id: userId },
    attributes: ['id', 'password'],
  })
}

const updatePassword = async (userId, newPassword) => {
  await User.update(
    { password: newPassword },
    { where: { id: userId } }
  )
}

const updateLastLogin = async (userId) => {
  await User.update(
    { last_login: new Date() },
    { where: { id: userId } }
  )
}

const saveRefreshToken = async (userId, token, expiresAt) => {
  await Session.create({
    user_id: userId,
    refresh_token: token,
    expires_at: expiresAt,
  })
}

const findRefreshToken = async (token) => {
  return await Session.findOne({
    where: { refresh_token: token },
  })
}

const deleteRefreshToken = async (token) => {
  await Session.destroy({
    where: { refresh_token: token },
  })
}

const savePasswordResetToken = async (userId, token, expiresAt) => {
  await PasswordReset.upsert({
    user_id: userId,
    token,
    expires_at: expiresAt,
    used: false,
  })
}

const findPasswordResetToken = async (token) => {
  return await PasswordReset.findOne({
    where: { token, used: false },
  })
}

const markResetTokenAsUsed = async (token) => {
  await PasswordReset.update(
    { used: true },
    { where: { token } }
  )
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  findPasswordByUserId,
  updatePassword,
  updateLastLogin,
  saveRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
  savePasswordResetToken,
  findPasswordResetToken,
  markResetTokenAsUsed,
}