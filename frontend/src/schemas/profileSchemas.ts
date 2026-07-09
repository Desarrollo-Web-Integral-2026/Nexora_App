import { z } from 'zod'

// Criterio 2 - mismos límites/regex que ya usa el backend (validate.middleware.js)
// para que el usuario vea el error antes de mandar el request
export const profileSchema = z.object({
    nombre: z
        .string()
        .min(2, 'el nombre debe tener al menos 2 caracteres')
        .max(50, 'El  nombre no puede exceder 100 caracteres')
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras'),

    apellido: z
        .string()
        .min(2, 'El apellido debe tener al menos 2 caracteres')
        .max(50, 'Los apellidos no pueden exceder 50 caracteres')
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Los apellidos solo pueden contener letras'),

    descripcion: z
        .string()
        .max(300, 'La descripción no puede exceder 300 caracteres')
        .optional()
        .or(z.literal('')),
})

export type ProfileFormData = z.infer<typeof profileSchema>

// Criterio 5 - validación de avatar en frontend antes de enviar
export const AVATAR_ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
export const AVATAR_MAX_SIZE = 2 * 1024 * 1024 // 2MB

export const validateAvatarFile = (file: File): string | null => {
    if (!AVATAR_ALLOWED_TYPES.includes(file.type)) {
        return 'Formato no permitido. Usa JPG, PNG o WEBP'
    }
    if (file.size > AVATAR_MAX_SIZE) {
        return 'La imagen no debe superar los 2MB'
    }
    return null
}