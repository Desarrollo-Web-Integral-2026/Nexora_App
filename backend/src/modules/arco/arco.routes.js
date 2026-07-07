const { Router } = require('express')
const controller = require('./arco.controller')
const { verifyToken } = require('../../middlewares/auth.middleware')

const router = Router()

// Todos los endpoints ARCO requieren autenticación
router.use(verifyToken)

router.get('/my-data', controller.getMyData)           // Acceso
router.put('/my-data', controller.updateMyData)        // Rectificación
router.delete('/cancel-account', controller.cancelMyAccount)  // Cancelación
router.post('/oppose', controller.opposeDataUsage)     // Oposición

module.exports = router