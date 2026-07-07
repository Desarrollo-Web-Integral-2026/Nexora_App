const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db.mysql')

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  // Criterio 2 — solo IDs, nunca datos personales
  user_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  accion: {
    type: DataTypes.ENUM(
      'LOGIN_SUCCESS',
      'LOGIN_FAILED',
      'LOGOUT',
      'REGISTER',
      'PASSWORD_CHANGE',
      'PASSWORD_RESET_REQUEST',
      'PASSWORD_RESET',
      'ARCO_ACCESS',
      'ARCO_RECTIFICATION',
      'ARCO_CANCELLATION',
      'ARCO_OPPOSITION',
      'MEDIA_UPLOAD',
      'MEDIA_DELETE',
      'EXTERNAL_TRANSFER',
      'PROFILE_UPDATE',
      'DATA_READ',
    ),
    allowNull: false,
  },
  entidad: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  entidad_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  endpoint: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  metodo: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  ip: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  // Criterio 6 — transferencias a externos
  servicio_externo: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  tipo_operacion: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  exitoso: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  detalle: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'audit_logs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
})

module.exports = AuditLog