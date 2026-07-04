// src/config/db.mysql.js
const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
    },
  }
)

const connectMySQL = async () => {
  try {
    require('../models/index')
    await sequelize.authenticate()
    console.log('[MySQL] Conexión exitosa a filess.io')

    await sequelize.sync({ alter: true })
    console.log('[MySQL] Modelos sincronizados')
  } catch (err) {
    console.error('[MySQL] Error de conexión:', err.message)
    process.exit(1)
  }
}

module.exports = { sequelize, connectMySQL }