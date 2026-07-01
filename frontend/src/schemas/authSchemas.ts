import { z } from 'zod'

export const registerSchema = z
  .object({
    nombre: z
      .string()
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(50, 'El nombre no puede exceder 50 caracteres')
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras'),

    apellido: z
      .string()
      .min(2, 'El apellido debe tener al menos 2 caracteres')
      .max(50, 'El apellido no puede exceder 50 caracteres')
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El apellido solo puede contener letras'),

    correo: z
      .string()
      .email('Ingresa un correo electrónico válido')
      .max(100, 'El correo no puede exceder 100 caracteres')
      .transform((val) => val.toLowerCase().trim()),

    rol: z.enum(['artist', 'client'], {
      message: 'Selecciona un rol válido',
    }),

    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .max(72, 'La contraseña no puede exceder 72 caracteres')
      .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
      .regex(/[0-9]/, 'Debe contener al menos un número')
      .regex(/[^a-zA-Z0-9]/, 'Debe contener al menos un carácter especial'),

    confirmPassword: z.string(),

    aceptaPrivacidad: z.literal(true, {
      message: 'Debes aceptar el aviso de privacidad y términos',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

export const loginSchema = z.object({
  correo: z
    .string()
    .email('Ingresa un correo electrónico válido')
    .transform((val) => val.toLowerCase().trim()),

  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .max(72, 'Contraseña inválida'),
})

export type RegisterFormData = z.infer<typeof registerSchema>
export type LoginFormData = z.infer<typeof loginSchema>