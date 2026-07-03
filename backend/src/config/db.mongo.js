const mongoose = require('mongoose')
 
let isConnected = false

const connectMongo = async () => {
    if (isConnected) return

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: 'nexora_db_smalllips'
        })

        isConnected = true
        console.log('[MongoDB] Conexión exitosa a filess.io')

        mongoose.connection.on('error', (err) => {
            console.error('[MongoDB] Error: ', err.message)
        })

        mongoose.connection.on('disconnected', () => {
            console.warn('[MongoDB] Desconectado')
            isConnected = false
        })
    } catch (err) {
        console.error('[MongoDB] Error de Conexión:', err.message)
        process.exit(1)
    }
}

module.exports = { connectMongo }