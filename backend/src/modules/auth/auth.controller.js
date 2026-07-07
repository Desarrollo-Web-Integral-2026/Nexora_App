const authService = require('./auth.service')
const auditService = require('../audit/audit.service')
const { success, error } = require('../../utils/response')

const register = async (req, res) => {
  try {
    const { nombre, apellido, correo, password, rol, fechaAceptacion, aceptaPrivacidad } = req.body

    const user = await authService.register({
      nombre, apellido, correo, password, rol, fechaAceptacion, aceptaPrivacidad
    })

    // Criterio 9 — log de registro exitoso
    await auditService.log({
      userId: user.id,
      accion: 'REGISTER',
      entidad: 'users',
      entidadId: user.id,
      endpoint: req.originalUrl,
      metodo: req.method,
      ip: req.ip || req.headers['x-forwarded-for'],
      exitoso: true,
    })

    return success(res, { id: user.id, correo: user.correo, rol: user.rol }, 'Usuario registrado correctamente', 201)
  } catch (err) {
    // Criterio 9 — log de registro fallido
    await auditService.log({
      accion: 'REGISTER',
      entidad: 'users',
      endpoint: req.originalUrl,
      metodo: req.method,
      ip: req.ip || req.headers['x-forwarded-for'],
      exitoso: false,
      detalle: err.message,
    })

    return error(res, err.message, err.status || 500)
  }
}

const login = async (req, res) => {
  const ip = req.ip || req.headers['x-forwarded-for']

  try {
    const { correo, password } = req.body

    if (!correo || !password) {
      return error(res, 'Correo y contraseña son obligatorios', 400)
    }

    const { accessToken, refreshToken, user } = await authService.login({ correo, password })

    // Criterio 9 — log de login exitoso con IP y timestamp (via created_at)
    await auditService.log({
      userId: user.id,
      accion: 'LOGIN_SUCCESS',
      entidad: 'users',
      entidadId: user.id,
      endpoint: req.originalUrl,
      metodo: req.method,
      ip,
      exitoso: true,
    })

    // Refresh token en cookie HttpOnly
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    })

    return success(res, { accessToken, user }, 'Login exitoso')
  } catch (err) {
    // Criterio 9 — log de intento fallido con IP y timestamp
    await auditService.log({
      accion: 'LOGIN_FAILED',
      entidad: 'users',
      endpoint: req.originalUrl,
      metodo: req.method,
      ip,
      exitoso: false,
      detalle: err.message,
    })

    // Alerta si hay patrón de fuerza bruta desde esta IP (no bloquea la respuesta)
    auditService.checkSuspiciousActivity(ip)

    return error(res, err.message, err.status || 500)
  }
}

const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refresh_token

    const { accessToken, user } = await authService.refresh(refreshToken)

    return success(res, { accessToken, user }, 'Token renovado')
  } catch (err) {
    return error(res, err.message, err.status || 500)
  }
}

const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refresh_token
    await authService.logout(refreshToken)

    // Criterio 9/10 — log de cierre de sesión (invalidación de tokens)
    await auditService.log({
      userId: req.user?.id || null,
      accion: 'LOGOUT',
      entidad: 'users',
      endpoint: req.originalUrl,
      metodo: req.method,
      ip: req.ip || req.headers['x-forwarded-for'],
      exitoso: true,
    })

    res.clearCookie('refresh_token')
    return success(res, null, 'Sesión cerrada correctamente')
  } catch (err) {
    return error(res, err.message, err.status || 500)
  }
}

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const userId = req.user.id

    if (!currentPassword || !newPassword) {
      return error(res, 'Contraseña actual y nueva son obligatorias', 400)
    }

    await authService.changePassword(userId, { currentPassword, newPassword })

    return success(res, null, 'Contraseña actualizada correctamente')
  } catch (err) {
    return error(res, err.message, err.status || 500)
  }
}

const requestPasswordReset = async (req, res) => {
  try {
    const { correo } = req.body

    if (!correo) {
      return error(res, 'Correo es obligatorio', 400)
    }

    await authService.requestPasswordReset(correo)

    // Siempre responder igual para no revelar si el correo existe
    return success(res, null, 'Si el correo existe recibirás un enlace de recuperación')
  } catch (err) {
    return error(res, err.message, err.status || 500)
  }
}

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body

    if (!token || !newPassword) {
      return error(res, 'Token y nueva contraseña son obligatorios', 400)
    }

    await authService.resetPassword(token, newPassword)

    return success(res, null, 'Contraseña restablecida correctamente')
  } catch (err) {
    return error(res, err.message, err.status || 500)
  }
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