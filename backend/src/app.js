require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const { connectMongo } = require('./config/db.mongo')
const { runCleanupJobs } = require('./jobs/cleanup.job')
const authRoutes = require('./modules/auth/auth.routes')
const { connectMySQL } = require('./config/db.mysql')
const arcoRoutes = require('./modules/arco/arco.routes')
const { connectCloudinary } = require('./config/cloudinary')
const userRoutes = require('./modules/user/user.routes')

// Job de limpieza automática cada 24 horas
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000
setInterval(async () => {
  await runCleanupJobs()
}, TWENTY_FOUR_HOURS)

// Correr una vez al iniciar en producción
if (process.env.NODE_ENV === 'production') {
  runCleanupJobs()
}

const app = express()

// Conexiones a base de datos
connectMySQL()
connectMongo()
connectCloudinary()

// Seguridad HTTP headers
app.use(helmet())

// CORS - solo acepta peticiones del frontend
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true, // permite cookies HttpOnly
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content.Type', 'Authorization'],
}))

// Parsers
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb'}))
app.use(cookieParser())

// Logger en desarrollo
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Nexora API corriendo',
        timestamp: new Date().toISOString(),
    })
})

app.get('/api/data-policy', (req, res) => {
  const { getAllPolicies } = require('./config/dataPolicy')
  res.status(200).json({
    success: true,
    message: 'Política de retención de datos de Nexora',
    data: getAllPolicies(),
  })
})

// Rutas
app.use('/api/auth', authRoutes)
app.use('/api/arco', arcoRoutes)
app.use('/api/profile', userRoutes)

// Ruta no econtrada
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Ruta ${req.method} ${req.originalUrl} no encontrada`,
    })
})

// Manejador global de errores
app.use((err, req, res, next) => {
    console.error(`[EROR] ${err.message}`)
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Error interno del Servidor'
    })
})

module.exports = app