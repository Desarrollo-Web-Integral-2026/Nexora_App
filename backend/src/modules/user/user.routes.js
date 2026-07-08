const { Router } = require('express')
const controller = require('./user.controller')
const { verifyToken } = require('../../middlewares/auth.middleware')
const { validateProfileUpdate } = require('../../middlewares/validate.middleware')
const { handleAvatarUpload } = require('../../middlewares/upload.middleware')
const { auditLog } = require('../../middlewares/audit.middleware')

const router = Router()

// Criterio 7 — todos los endpoints de perfil requieren JWT válido
router.use(verifyToken)

router.get('/', auditLog('PROFILE_ACCESS', 'users'), controller.getProfile)
router.put('/', validateProfileUpdate, auditLog('PROFILE_UPDATE', 'users'), controller.updateProfile)
router.put('/avatar', handleAvatarUpload, auditLog('AVATAR_UPDATE', 'users'), controller.updateAvatar)

module.exports = router