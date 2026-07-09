import api from './api'

export interface Profile {
    id: string
    nombre: string
    apellido: string
    correo: string
    rol: 'artist' | 'client'
    avatar_url: string | null
    descripcion: string | null
    created_at?: string
}

interface ApiResponse<T> {
    success: boolean
    message: string
    data: T
}

export const getProfile = async (): Promise<Profile> => {
    const { data } = await api.get<ApiResponse<Profile>>('/profile')
    return data.data
}

export const updateProfile = async (payload: {
    nombre: string
    apellido: string
    descripcion?: string
}): Promise<Profile> => {
    const { data } = await api.put<ApiResponse<Profile>>('/profile', payload)
    return data.data
}

// Criterio 4 - se envia como multipart/form-data, tal como espera el backend (multer)
export const updateAvatar = async (file: File): Promise<Profile> => {
    const formData = new FormData()
    formData.append('avatar', file)

    const { data } = await api.put<ApiResponse<Profile>>('/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.data
}