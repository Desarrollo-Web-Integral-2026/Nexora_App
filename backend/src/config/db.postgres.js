const { Pool } = require('pg')

let pool = null

const getPool = () => {
    if (!pool) {
        pool = new Pool ({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            ssl: false,
            max: 10,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        })

        pool.on('error', (err) => {
            console.error('[PostgreSQL] Error inesperado:', err.message)
        })
    }

    return pool
}

const connectPostgres = async() => {
    try {
        const client = await getPool().connect()
        console.log('[PostgreSQL] Conexión exitosa a filess.io')
        client.release()
    } catch (err) {
        console.error('[PostgreSQL] Error de conexión: ', err.message)
        process.exit(1)
    }
}

module.exports = { getPool, connectPostgres }