// src/pages/Register.tsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { registerSchema, type RegisterFormData } from '../schemas/authSchemas'
import FormInput from '../components/ui/FormInput'

function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    // Sanitizar antes de enviar
    const payload = {
      nombre: data.nombre.trim(),
      apellido: data.apellido.trim(),
      correo: data.correo.toLowerCase().trim(),
      rol: data.rol,
      password: data.password,
      aceptaPrivacidad: data.aceptaPrivacidad,
      fechaAceptacion: new Date().toISOString(),
    }

    console.log('Payload sanitizado:', payload)
    // TODO: llamar a api.post('/auth/register', payload)
  }

  return (
    <div className="min-h-screen bg-[#0F0F1A] flex items-center justify-center px-6 py-16">
      {/* Fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[400px] h-[400px] bg-[#6C3FC5] opacity-20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-[#E040FB] opacity-20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="text-3xl font-bold bg-gradient-to-r from-[#6C3FC5] to-[#E040FB] bg-clip-text text-transparent"
          >
            Nexora
          </Link>
          <p className="text-gray-500 text-sm mt-2">Crea tu cuenta</p>
        </div>

        {/* Card */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">

            {/* Nombre y Apellido */}
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Nombre"
                type="text"
                placeholder="Luis"
                autoComplete="given-name"
                {...register('nombre')}
                error={errors.nombre?.message}
              />
              <FormInput
                label="Apellido"
                type="text"
                placeholder="López"
                autoComplete="family-name"
                {...register('apellido')}
                error={errors.apellido?.message}
              />
            </div>

            {/* Correo */}
            <FormInput
              label="Correo electrónico"
              type="email"
              placeholder="correo@ejemplo.com"
              autoComplete="email"
              {...register('correo')}
              error={errors.correo?.message}
            />

            {/* Rol */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">Rol</label>
              <select
                {...register('rol')}
                className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white outline-none transition-all duration-200
                  focus:ring-2 focus:ring-[#6C3FC5]/50
                  ${errors.rol ? 'border-red-500' : 'border-white/10 focus:border-[#6C3FC5]/50'}
                `}
              >
                <option value="" className="bg-[#0F0F1A]">Selecciona un rol</option>
                <option value="artist" className="bg-[#0F0F1A]">Artista</option>
                <option value="client" className="bg-[#0F0F1A]">Cliente</option>
              </select>
              {errors.rol && (
                <span className="text-red-400 text-xs">{errors.rol.message}</span>
              )}
            </div>

            {/* Contraseña */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 8 caracteres"
                  autoComplete="new-password"
                  {...register('password')}
                  className={`w-full px-4 py-3 pr-12 rounded-xl bg-white/5 border text-white placeholder-gray-500 outline-none transition-all duration-200
                    focus:ring-2 focus:ring-[#6C3FC5]/50
                    ${errors.password ? 'border-red-500' : 'border-white/10 focus:border-[#6C3FC5]/50'}
                  `}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <span className="text-red-400 text-xs">{errors.password.message}</span>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">Confirmar contraseña</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repite tu contraseña"
                  autoComplete="new-password"
                  {...register('confirmPassword')}
                  className={`w-full px-4 py-3 pr-12 rounded-xl bg-white/5 border text-white placeholder-gray-500 outline-none transition-all duration-200
                    focus:ring-2 focus:ring-[#6C3FC5]/50
                    ${errors.confirmPassword ? 'border-red-500' : 'border-white/10 focus:border-[#6C3FC5]/50'}
                  `}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="text-red-400 text-xs">{errors.confirmPassword.message}</span>
              )}
            </div>

            {/* Aceptar privacidad */}
            <div className="flex flex-col gap-1.5">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('aceptaPrivacidad')}
                  className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 accent-[#6C3FC5] cursor-pointer"
                />
                <span className="text-sm text-gray-400 leading-relaxed">
                  He leído y acepto el{' '}
                  <Link
                    to="/privacy"
                    target="_blank"
                    className="text-[#E040FB] underline hover:text-[#6C3FC5] transition-colors"
                  >
                    Aviso de Privacidad
                  </Link>{' '}
                  y los Términos y Condiciones de Nexora.
                </span>
              </label>
              {errors.aceptaPrivacidad && (
                <span className="text-red-400 text-xs">
                  {errors.aceptaPrivacidad.message}
                </span>
              )}
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#6C3FC5] to-[#E040FB] text-white font-semibold
                hover:shadow-lg hover:shadow-[#6C3FC5]/25 transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2 group"
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Crear cuenta
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Login link */}
            <p className="text-center text-sm text-gray-500">
              ¿Ya tienes cuenta?{' '}
              <Link
                to="/login"
                className="text-[#E040FB] hover:text-[#6C3FC5] transition-colors underline"
              >
                Inicia sesión
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  )
}

export default Register