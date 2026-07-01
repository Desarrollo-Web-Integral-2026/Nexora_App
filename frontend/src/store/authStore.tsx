import { create } from 'zustand';

interface User {
    id: string,
    nombre: string,
    apellido: string,
    correo: string,
    rol: 'artist' | 'client'
}

interface AuthState {
    accessToken: string | null,
    user: User | null,
    setAuth: (token: string, user: User) => void
    clearAuth: () => void
}

const useAuthStore = create<AuthState>((set) =>({
    accessToken: null,
    user: null,
    setAuth: (token, user) => set({ accessToken: null, user: null}),
    clearAuth: () => set({ accessToken: null, user: null}),
}))

export default useAuthStore