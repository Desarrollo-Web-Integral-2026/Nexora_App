const { getPool } = require('../../config/db.mysql')

const createUser = async ({ nombre, apellido, correo, password, rol, fechaAceptacion }) => {
  const pool = getPool()
  const result = await pool.query(
    `INSERT INTO users 
      (nombre, apellido, correo, password, rol, acepta_privacidad, fecha_aceptacion, status, created_at)
     VALUES ($1, $2, $3, $4, $5, true, $6, 'active', NOW())
     RETURNING id, nombre, apellido, correo, rol, created_at`,
    [nombre, apellido, correo, password, rol, fechaAceptacion]
  )
  return result.rows[0]
}

const findUserByEmail = async (correo) => {
  const pool = getPool()
  const result = await pool.query(
    `SELECT id, nombre, apellido, correo, password, rol, status
     FROM users WHERE correo = $1`,
    [correo]
  )
  return result.rows[0] || null
}

const findUserById = async (id) => {
  const pool = getPool()
  const result = await pool.query(
    `SELECT id, nombre, apellido, correo, rol, status, avatar_url, descripcion
     FROM users WHERE id = $1`,
    [id]
  )
  return result.rows[0] || null
}

const saveRefreshToken = async (userId, token, expiresAt) => {
  const pool = getPool()
  await pool.query(
    `INSERT INTO sessions (user_id, refresh_token, expires_at, created_at)
     VALUES ($1, $2, $3, NOW())`,
    [userId, token, expiresAt]
  )
}

const findRefreshToken = async (token) => {
  const pool = getPool()
  const result = await pool.query(
    `SELECT * FROM sessions WHERE refresh_token = $1 AND expires_at > NOW()`,
    [token]
  )
  return result.rows[0] || null
}

const deleteRefreshToken = async (token) => {
  const pool = getPool()
  await pool.query(
    `DELETE FROM sessions WHERE refresh_token = $1`,
    [token]
  )
}

const updatePassword = async (userId, newPassword) => {
  const pool = getPool()
  await pool.query(
    `UPDATE users SET password = $1 WHERE id = $2`,
    [newPassword, userId]
  )
}

const savePasswordResetToken = async (userId, token, expiresAt) => {
  const pool = getPool()
  await pool.query(
    `INSERT INTO password_resets (user_id, token, expires_at, created_at)
     VALUES ($1, $2, $3, NOW())
     ON CONFLICT (user_id) DO UPDATE 
     SET token = $2, expires_at = $3, created_at = NOW()`,
    [userId, token, expiresAt]
  )
}

const findPasswordResetToken = async (token) => {
  const pool = getPool()
  const result = await pool.query(
    `SELECT * FROM password_resets 
     WHERE token = $1 AND expires_at > NOW() AND used = false`,
    [token]
  )
  return result.rows[0] || null
}

const markResetTokenAsUsed = async (token) => {
  const pool = getPool()
  await pool.query(
    `UPDATE password_resets SET used = true WHERE token = $1`,
    [token]
  )
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  saveRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
  updatePassword,
  savePasswordResetToken,
  findPasswordResetToken,
  markResetTokenAsUsed,
}