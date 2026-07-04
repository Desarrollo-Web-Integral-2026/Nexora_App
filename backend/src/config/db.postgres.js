const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
    define: {
      schema: 'public',
      timestamps: true,
      underscored: true,
    },
  }
)

const connectPostgres = async () => {
  try {
    await sequelize.authenticate()
    console.log('[PostgreSQL] Conexión exitosa a filess.io')

    // Sincroniza los modelos con la BD automáticamente
    await sequelize.sync({ alter: true })
    console.log('[PostgreSQL] Modelos sincronizados')
  } catch (err) {
    console.error('[PostgreSQL] Error de conexión:', err.message)
    process.exit(1)
  }
}

module.exports = { sequelize, connectPostgres }