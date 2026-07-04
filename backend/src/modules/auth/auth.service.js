const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { hashPassword, comparePassword } = require('../../utils/encrypt')
const repo = require('./auth.repository')

// Genera access token
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, correo: user.correo, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  )
}

// Genera refresh token
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  )
}

const register = async ({ nombre, apellido, correo, password, rol, fechaAceptacion }) => {
  // Verificar si el correo ya existe
  const existing = await repo.findUserByEmail(correo)
  if (existing) {
    const err = new Error('El correo ya está registrado')
    err.status = 409
    throw err
  }

  // Criterio 1 y 2 — hashear contraseña con bcrypt, nunca en texto plano
  const hashedPassword = await hashPassword(password)

  const user = await repo.createUser({
    nombre: nombre.trim(),
    apellido: apellido.trim(),
    correo: correo.toLowerCase().trim(),
    password: hashedPassword,
    rol,
    fechaAceptacion,
  })

  return user
}

const login = async ({ correo, password }) => {
  const user = await repo.findUserByEmail(correo.toLowerCase().trim())

  // Mensaje genérico para no revelar si el correo existe
  if (!user) {
    const err = new Error('Credenciales incorrectas')
    err.status = 401
    throw err
  }

  if (user.status === 'cancelled' || user.status === 'inactive') {
    const err = new Error('Cuenta inactiva o cancelada')
    err.status = 403
    throw err
  }

  // Criterio 3 — comparar con bcrypt.compare, nunca descifrar
  const isMatch = await comparePassword(password, user.password)
  if (!isMatch) {
    const err = new Error('Credenciales incorrectas')
    err.status = 401
    throw err
  }

  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)

  // Guardar refresh token en BD
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)
  await repo.saveRefreshToken(user.id, refreshToken, expiresAt)

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      correo: user.correo,
      rol: user.rol,
    },
  }
}

const refresh = async (refreshToken) => {
  if (!refreshToken) {
    const err = new Error('Refresh token requerido')
    err.status = 401
    throw err
  }

  // Verificar que el token existe en BD
  const session = await repo.findRefreshToken(refreshToken)
  if (!session) {
    const err = new Error('Refresh token inválido o expirado')
    err.status = 401
    throw err
  }

  // Verificar firma del token
  let decoded
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
  } catch {
    const err = new Error('Refresh token inválido')
    err.status = 401
    throw err
  }

  const user = await repo.findUserById(decoded.id)
  if (!user) {
    const err = new Error('Usuario no encontrado')
    err.status = 404
    throw err
  }

  const newAccessToken = generateAccessToken(user)

  return { accessToken: newAccessToken, user }
}

const logout = async (refreshToken) => {
  if (refreshToken) {
    await repo.deleteRefreshToken(refreshToken)
  }
}

// Criterio 4 — cambio de contraseña requiere contraseña actual
const changePassword = async (userId, { currentPassword, newPassword }) => {
  const pool = require('../../config/db.postgres').getPool()
  const result = await pool.query(
    `SELECT password FROM users WHERE id = $1`,
    [userId]
  )

  const user = result.rows[0]
  if (!user) {
    const err = new Error('Usuario no encontrado')
    err.status = 404
    throw err
  }

  // Verificar contraseña actual con bcrypt.compare
  const isMatch = await comparePassword(currentPassword, user.password)
  if (!isMatch) {
    const err = new Error('La contraseña actual es incorrecta')
    err.status = 400
    throw err
  }

  // Hashear nueva contraseña
  const hashedNew = await hashPassword(newPassword)
  await repo.updatePassword(userId, hashedNew)
}

// Criterio 5 — recuperación con token temporal, nunca enviando la contraseña
const requestPasswordReset = async (correo) => {
  const user = await repo.findUserByEmail(correo.toLowerCase().trim())

  // No revelar si el correo existe o no
  if (!user) return

  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 1) // expira en 1 hora

  await repo.savePasswordResetToken(user.id, token, expiresAt)

  // TODO: enviar correo con el token cuando se integre el servicio de email
  console.log(`[PasswordReset] Token para ${correo}: ${token}`)

  return token
}

const resetPassword = async (token, newPassword) => {
  const reset = await repo.findPasswordResetToken(token)
  if (!reset) {
    const err = new Error('Token inválido o expirado')
    err.status = 400
    throw err
  }

  const hashedNew = await hashPassword(newPassword)
  await repo.updatePassword(reset.user_id, hashedNew)
  await repo.markResetTokenAsUsed(token)
}

module.exports = {
  register,
  login,
  refresh,
  logout,
  changePassword,
  requestPasswordReset,
  resetPassword,
}