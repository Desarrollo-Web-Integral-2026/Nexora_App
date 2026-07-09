import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { loginSchema, type LoginFormData } from '../schemas/authSchemas'
import FormInput from '../components/ui/FormInput'
import api from '../service/api'
import useAuthStore from '../store/authStore'
import Toast, { type ToastData } from '../components/ui/Toast'

interface LoginResponse {
  success: boolean
  message: string
  data: {
    accessToken: string
    user: {
      id: string
      nombre: string
      apellido: string
      correo: string
      rol: 'artist' | 'client'
      avatar_url?: string | null
      descripcion?: string | null
    }
  }
}

function Login() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [showPassword, setShowPassword] = useState(false)
  const [toast, setToast] = useState<ToastData | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    const payload = {
      correo: data.correo.toLowerCase().trim(),
      password: data.password,
    }

    try {
      const { data: response } = await api.post<LoginResponse>('/auth/login', payload)
      console.log('Respuesta del login:', response) 
      const { accessToken, user } = response.data

      setAuth(accessToken, user)
      navigate('/profile')
    } catch (err) {
      console.error('Error en login:', err)
      setToast({ type: 'error', message: 'Correo o contraseña incorrectos. Intenta de nuevo.' })
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0F1A] flex items-center justify-center px-6">
      {/* Fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[400px] h-[400px] bg-[#6C3FC5] opacity-20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-[#E040FB] opacity-20 rounded-full blur-[120px]" />
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
          <p className="text-gray-500 text-sm mt-2">Bienvenido de vuelta</p>
        </div>

        {/* Card */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">

            <FormInput
              label="Correo electrónico"
              type="email"
              placeholder="correo@ejemplo.com"
              autoComplete="email"
              {...register('correo')}
              error={errors.correo?.message}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Tu contraseña"
                  autoComplete="current-password"
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
                  Iniciar sesión
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-500">
              ¿No tienes cuenta?{' '}
              <Link
                to="/register"
                className="text-[#E040FB] hover:text-[#6C3FC5] transition-colors underline"
              >
                Regístrate
              </Link>
            </p>

          </form>
        </div>
      </div>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  )
}

export default Login