const { uploadFile, deleteFile, getSignedUrl } = require('../../config/cloudinary')
const auditService = require('../audit/audit.service')
const User = require('../../models/user.model')

// Criterio 1 — verificar que el usuario aceptó el aviso de privacidad
const verifyPrivacyConsent = async (userId) => {
  const user = await User.findOne({
    where: { id: userId },
    attributes: ['acepta_privacidad', 'fecha_aceptacion'],
  })

  if (!user || !user.acepta_privacidad) {
    const err = new Error(
      'Debes aceptar el aviso de privacidad antes de subir archivos. ' +
      'Tus archivos serán almacenados en Cloudinary según lo indicado en el aviso.'
    )
    err.status = 403
    throw err
  }
}

// Subir archivo a Cloudinary
const upload = async (userId, fileBuffer, folder = 'nexora') => {
  // Criterio 1 — verificar consentimiento antes de transferir
  await verifyPrivacyConsent(userId)

  const result = await uploadFile(fileBuffer, { folder })

  // Criterio 4 — registrar transferencia en log de auditoría
  await auditService.log({
    userId,
    accion: 'EXTERNAL_TRANSFER',
    entidad: 'media',
    servicioExterno: 'cloudinary',
    // Criterio 6 — solo tipo de operación, sin datos personales
    tipoOperacion: 'UPLOAD',
    exitoso: true,
    detalle: `public_id: ${result.public_id}`,
  })

  return {
    url: result.secure_url,
    publicId: result.public_id,
    formato: result.format,
    bytes: result.bytes,
  }
}

// Obtener URL firmada
const getSecureUrl = async (userId, publicId) => {
  const signedUrl = getSignedUrl(publicId)

  // Criterio 4 — registrar acceso
  await auditService.log({
    userId,
    accion: 'EXTERNAL_TRANSFER',
    entidad: 'media',
    servicioExterno: 'cloudinary',
    tipoOperacion: 'SIGNED_URL_GENERATED',
    exitoso: true,
    detalle: `public_id: ${publicId}`,
  })

  return signedUrl
}

// Criterio 5 — eliminar archivos de Cloudinary cuando el usuario cancela su cuenta
const deleteUserFiles = async (userId, publicIds = []) => {
  const results = []

  for (const publicId of publicIds) {
    try {
      await deleteFile(publicId)

      // Criterio 4 — registrar eliminación
      await auditService.log({
        userId,
        accion: 'EXTERNAL_TRANSFER',
        entidad: 'media',
        servicioExterno: 'cloudinary',
        tipoOperacion: 'DELETE',
        exitoso: true,
        detalle: `public_id: ${publicId}`,
      })

      results.push({ publicId, deleted: true })
    } catch (err) {
      await auditService.log({
        userId,
        accion: 'EXTERNAL_TRANSFER',
        entidad: 'media',
        servicioExterno: 'cloudinary',
        tipoOperacion: 'DELETE',
        exitoso: false,
        detalle: `public_id: ${publicId} error: ${err.message}`,
      })

      results.push({ publicId, deleted: false, error: err.message })
    }
  }

  return results
}

module.exports = { upload, getSecureUrl, deleteUserFiles, verifyPrivacyConsent }