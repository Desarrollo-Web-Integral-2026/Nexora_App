const { body, validationResult } = require('express-validator')

// Criterio 8 — el backend revalida todo aunque venga correcto del frontend
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Datos inválidos',
      errors: errors.array().map((e) => ({
        campo: e.path,
        mensaje: e.msg,
      })),
    })
  }
  next()
}

// Criterios 1, 2, 5, 7 — validaciones del registro
const validateRegister = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El nombre solo puede contener letras'),

  body('apellido')
    .trim()
    .notEmpty().withMessage('El apellido es obligatorio')
    .isLength({ min: 2, max: 50 }).withMessage('El apellido debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El apellido solo puede contener letras'),

  body('correo')
    .trim()
    .notEmpty().withMessage('El correo es obligatorio')
    .isEmail().withMessage('El correo no tiene un formato válido')
    .normalizeEmail()
    .isLength({ max: 100 }).withMessage('El correo no puede exceder 100 caracteres'),

  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 8, max: 72 }).withMessage('La contraseña debe tener entre 8 y 72 caracteres')
    .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una mayúscula')
    .matches(/[0-9]/).withMessage('La contraseña debe contener al menos un número')
    .matches(/[^a-zA-Z0-9]/).withMessage('La contraseña debe contener al menos un carácter especial'),

  body('rol')
    .notEmpty().withMessage('El rol es obligatorio')
    .isIn(['artist', 'client']).withMessage('El rol debe ser artist o client'),

  body('aceptaPrivacidad')
    .notEmpty().withMessage('Debes aceptar el aviso de privacidad')
    .isBoolean().withMessage('El campo aceptaPrivacidad debe ser true o false')
    .custom((value) => {
      if (value !== true) {
        throw new Error('Debes aceptar el aviso de privacidad para continuar')
      }
      return true
    }),

  body('fechaAceptacion')
    .notEmpty().withMessage('La fecha de aceptación es obligatoria')
    .isISO8601().withMessage('La fecha de aceptación no tiene un formato válido'),

  handleValidationErrors,
]

// Validaciones del login
const validateLogin = [
  body('correo')
    .trim()
    .notEmpty().withMessage('El correo es obligatorio')
    .isEmail().withMessage('El correo no tiene un formato válido')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria'),

  handleValidationErrors,
]

// Criterios 2, 3, 8 — validación y sanitización del perfil
// El correo NO se incluye aquí a propósito: aunque lo envíen, el
// service lo ignora explícitamente (criterio 3), así que ni siquiera lo validamos.
const validateProfileUpdate = [
  body('nombre')
    .optional()
    .trim()
    .escape()
    .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El nombre solo puede contener letras'),

  body('apellido')
    .optional()
    .trim()
    .escape()
    .isLength({ min: 2, max: 50 }).withMessage('El apellido debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El apellido solo puede contener letras'),

  body('descripcion')
    .optional({ nullable: true })
    .trim()
    .escape()
    .isLength({ max: 300 }).withMessage('La descripción no puede exceder 300 caracteres'),

  handleValidationErrors,
]

module.exports = { validateRegister, validateLogin, validateProfileUpdate, handleValidationErrors }