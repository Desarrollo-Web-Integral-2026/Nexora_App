const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db.mysql')
const User = require('./user.model')

const PasswordReset = sequelize.define('PasswordReset', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: User,
      key: 'id',
    },
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  used: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'password_resets',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
})

User.hasOne(PasswordReset, { foreignKey: 'user_id' })
PasswordReset.belongsTo(User, { foreignKey: 'user_id' })

module.exports = PasswordReset