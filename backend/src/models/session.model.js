const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db.mysql')
const User = require('./user.model')

const Session = sequelize.define('Session', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  refresh_token: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'sessions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
})

User.hasMany(Session, { foreignKey: 'user_id' })
Session.belongsTo(User, { foreignKey: 'user_id' })

module.exports = Session