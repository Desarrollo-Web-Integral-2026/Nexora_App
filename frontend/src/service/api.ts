import axios, { AxiosRequestConfig } from 'axios'
import useAuthStore from '../store/authStore'

interface RefreshResponse {
  accessToken: string
  user: {
    id: string
    nombre: string
    apellido: string
    correo: string
    rol: 'artist' | 'client'
  }
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    if (
      import.meta.env.PROD &&
      config.url?.startsWith('http://')
    ) {
      config.url = config.url.replace('http://', 'https://')
    }

    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const { data } = await axios.post<RefreshResponse>(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        )

        useAuthStore.getState().setAuth(data.accessToken, data.user)

        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`
        }

        return api(originalRequest)
      } catch {
        useAuthStore.getState().clearAuth()
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default api