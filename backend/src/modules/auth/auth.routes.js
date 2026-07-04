const { Router } = require('express')
const controller = require('./auth.controller')
const { verifyToken } = require('../../middlewares/auth.middleware')

const router = Router()

router.post('/register', controller.register)
router.post('/login', controller.login)
router.post('/refresh', controller.refresh)
router.post('/logout', controller.logout)
router.put('/change-password', verifyToken, controller.changePassword)
router.post('/forgot-password', controller.requestPasswordReset)
router.post('/reset-password', controller.resetPassword)

module.exports = router