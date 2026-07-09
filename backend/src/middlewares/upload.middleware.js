const multer = require('multer')

// Criterio 5 — tipos permitidos y tamaño máximo (2MB) para el avatar
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

// Guardamos el archivo en memoria (buffer) para subirlo directo a Cloudinary,
// sin escribirlo a disco — consistente con media.service.js / cloudinary.js
const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    const err = new Error('Formato de imagen no permitido. Usa JPG, PNG o WEBP')
    err.status = 400
    return cb(err, false)
  }
  cb(null, true)
}

const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
}).single('avatar')

// Envolvemos multer para transformar sus errores (LIMIT_FILE_SIZE, etc.)
// en el mismo formato de respuesta que usa el resto de la API
const handleAvatarUpload = (req, res, next) => {
  uploadAvatar(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'La imagen no debe superar los 2MB',
        })
      }
      return res.status(400).json({ success: false, message: err.message })
    }

    if (err) {
      return res.status(err.status || 400).json({ success: false, message: err.message })
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Debes enviar una imagen (campo "avatar")' })
    }

    next()
  })
}

module.exports = { handleAvatarUpload }