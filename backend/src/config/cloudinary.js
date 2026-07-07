const cloudinary = require('cloudinary').v2

// Criterio 2 y 3 — configuración segura via variables de entorno, nunca expuesta
const connectCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true, // fuerza HTTPS en todas las transferencias
  })

  console.log('[Cloudinary] Configuración lista')
}

// Criterio 6 — solo subir el archivo, sin datos personales adicionales
const uploadFile = async (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: options.folder || 'nexora',
      resource_type: options.resourceType || 'auto',
      // Criterio 6 — no se envían datos del usuario a Cloudinary
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    )

    uploadStream.end(fileBuffer)
  })
}

// Criterio 5 — eliminar archivos cuando el usuario cancela su cuenta
const deleteFile = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId)
}

// URL firmada con expiración — criterio 2
const getSignedUrl = (publicId, expiresInSeconds = 3600) => {
  return cloudinary.url(publicId, {
    sign_url: true,
    expires_at: Math.floor(Date.now() / 1000) + expiresInSeconds,
    secure: true,
  })
}

module.exports = { connectCloudinary, uploadFile, deleteFile, getSignedUrl }