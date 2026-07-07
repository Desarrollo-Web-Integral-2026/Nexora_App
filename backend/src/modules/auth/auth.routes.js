const { Router } = require('express')
const controller = require('./auth.controller')
const { verifyToken } = require('../../middlewares/auth.middleware')
const { validateRegister, validateLogin } = require('../../middlewares/validate.middleware')
const { loginRateLimiter } = require('../../middlewares/rateLimiter.middleware')

const router = Router()

router.post('/register', validateRegister, controller.register)
router.post('/login', loginRateLimiter, validateLogin, controller.login)
router.post('/refresh', controller.refresh)
router.post('/logout', controller.logout)
router.put('/change-password', verifyToken, controller.changePassword)
router.post('/forgot-password', controller.requestPasswordReset)
router.post('/reset-password', controller.resetPassword)

module.exports = router