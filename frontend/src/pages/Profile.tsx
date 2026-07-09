import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Pencil, Camera, Check, X as XIcon, Loader2, ArrowLeft,
} from 'lucide-react'
import useAuthStore from '../store/authStore'
import { getProfile, updateProfile, updateAvatar } from '../service/profileService'
import { profileSchema, validateAvatarFile, type ProfileFormData } from '../schemas/profileSchemas'
import FormInput from '../components/ui/FormInput'
import Toast, { type ToastData } from '../components/ui/Toast'

const ROLE_LABELS: Record<string, string> = {
  artist: 'Artista',
  client: 'Cliente',
}

function Profile() {
  const navigate = useNavigate()
  const { user, accessToken, updateUser } = useAuthStore()

  const [isEditing, setIsEditing] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [toast, setToast] = useState<ToastData | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    if (!accessToken) {
      navigate('/login')
    }
  }, [accessToken, navigate])

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        const profile = await getProfile()
        if (!active) return
        updateUser(profile)
        reset({
          nombre: profile.nombre,
          apellido: profile.apellido,
          descripcion: profile.descripcion ?? '',
        })
      } catch {
        if (active) {
          setToast({ type: 'error', message: 'No se pudo cargar tu perfil. Intenta de nuevo más tarde.' })
        }
      } finally {
        if (active) setIsLoadingProfile(false)
      }
    }

    load()
    return () => { active = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCancelEdit = () => {
    if (user) {
      reset({
        nombre: user.nombre,
        apellido: user.apellido,
        descripcion: user.descripcion ?? '',
      })
    }
    setIsEditing(false)
  }

  const onSubmit = async (formData: ProfileFormData) => {
    try {
      const updated = await updateProfile({
        nombre: formData.nombre,
        apellido: formData.apellido,
        descripcion: formData.descripcion,
      })
      updateUser(updated)
      setIsEditing(false)
      setToast({ type: 'success', message: 'Perfil actualizado correctamente' })
    } catch {
      setToast({ type: 'error', message: 'No se pudo actualizar tu perfil. Intenta de nuevo.' })
    }
  }

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validationError = validateAvatarFile(file)
    if (validationError) {
      setToast({ type: 'error', message: validationError })
      e.target.value = ''
      return
    }

    setPendingFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleCancelAvatar = () => {
    if (avatarPreview) URL.revokeObjectURL(avatarPreview)
    setAvatarPreview(null)
    setPendingFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleConfirmAvatar = async () => {
    if (!pendingFile) return
    setIsUploadingAvatar(true)
    try {
      const updated = await updateAvatar(pendingFile)
      updateUser(updated)
      handleCancelAvatar()
      setToast({ type: 'success', message: 'Avatar actualizado correctamente' })
    } catch {
      setToast({ type: 'error', message: 'No se pudo subir la imagen. Intenta con otro archivo.' })
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[400px] h-[400px] bg-primary opacity-20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-accent opacity-20 rounded-full blur-[120px]" />
      </div>

      <header className="relative z-10 backdrop-blur-xl bg-bg/70 border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <Link to="/" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Mi perfil
          </span>
        </div>
      </header>

      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">

          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="relative">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-white/5 border-2 border-white/10 flex items-center justify-center">
                {avatarPreview || user?.avatar_url ? (
                  <img
                    src={avatarPreview ?? user?.avatar_url ?? ''}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-gray-500">
                    {user?.nombre?.[0]?.toUpperCase()}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-gradient-to-r from-primary to-accent
                  flex items-center justify-center border-2 border-bg hover:scale-105 transition-transform
                  disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Cambiar avatar"
              >
                <Camera className="w-4 h-4 text-white" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarSelect}
              />
            </div>

            {pendingFile && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleConfirmAvatar}
                  disabled={isUploadingAvatar}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-accent
                    text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploadingAvatar ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Confirmar avatar
                </button>
                <button
                  type="button"
                  onClick={handleCancelAvatar}
                  disabled={isUploadingAvatar}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 border border-white/10
                    text-sm text-gray-300 hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  <XIcon className="w-4 h-4" />
                  Cancelar
                </button>
              </div>
            )}

            {!pendingFile && (
              <div className="text-center">
                <h2 className="text-lg font-semibold">{user?.nombre} {user?.apellido}</h2>
                <span className="inline-block mt-1 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs text-primary">
                  {ROLE_LABELS[user?.rol ?? ''] ?? user?.rol}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Información personal</h3>
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10
                  text-sm text-gray-300 hover:bg-white/10 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                Editar
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormInput
                label="Nombre"
                disabled={!isEditing}
                {...register('nombre')}
                error={errors.nombre?.message}
              />
              <FormInput
                label="Apellido"
                disabled={!isEditing}
                {...register('apellido')}
                error={errors.apellido?.message}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">Correo electrónico</label>
              <input
                type="email"
                value={user?.correo ?? ''}
                disabled
                readOnly
                className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5 text-gray-500 cursor-not-allowed outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">Descripción</label>
              <textarea
                rows={4}
                disabled={!isEditing}
                placeholder="Cuéntale a la comunidad sobre ti..."
                {...register('descripcion')}
                className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-500 outline-none
                  transition-all duration-200 resize-none disabled:bg-white/[0.02] disabled:text-gray-500 disabled:cursor-not-allowed
                  focus:ring-2 focus:ring-primary/50
                  ${errors.descripcion ? 'border-red-500' : 'border-white/10 focus:border-primary/50'}
                `}
              />
              {errors.descripcion && (
                <span className="text-red-400 text-xs">{errors.descripcion.message}</span>
              )}
            </div>

            {isEditing && (
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-accent
                    text-white font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Guardar cambios
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isSubmitting}
                  className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300
                    hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            )}
          </form>
        </div>
      </main>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  )
}

export default Profile