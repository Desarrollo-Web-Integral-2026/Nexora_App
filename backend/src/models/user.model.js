const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db.mysql')

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  apellido: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  correo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  rol: {
    type: DataTypes.ENUM('artist', 'client'),
    allowNull: false,
  },
  avatar_url: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  acepta_privacidad: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  fecha_aceptacion: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  opone_uso_secundario: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'cancelled'),
    defaultValue: 'active',
  },
  blocked_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})

module.exports = User