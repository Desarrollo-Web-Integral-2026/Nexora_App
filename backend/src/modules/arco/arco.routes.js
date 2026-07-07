const { Router } = require('express')
const controller = require('./arco.controller')
const { verifyToken } = require('../../middlewares/auth.middleware')
const { auditLog } = require('../../middlewares/audit.middleware')

const router = Router()

// Todos los endpoints ARCO requieren autenticación
router.use(verifyToken)

router.get('/my-data', controller.getMyData)   
router.put('/my-data', controller.updateMyData)     
router.delete('/cancel-account', controller.cancelMyAccount)  
router.post('/oppose', controller.opposeDataUsage)   

// Rutas de EndPoints de las Auditorias
router.get('/my-data', auditLog('ARCO_ACCESS', 'users'), controller.getMyData)
router.put('/my-data', auditLog('ARCO_RECTIFICATION', 'users'), controller.updateMyData)
router.delete('/cancel-account', auditLog('ARCO_CANCELLATION', 'users'), controller.cancelMyAccount)
router.post('/oppose', auditLog('ARCO_OPPOSITION', 'users'), controller.opposeDataUsage)

module.exports = router