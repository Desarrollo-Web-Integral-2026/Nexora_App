import { create } from 'zustand';

interface User {
    id: string,
    nombre: string,
    apellido: string,
    correo: string,
    rol: 'artist' | 'client',
    avatar_url?: string | null,
    descripcion?: string | null,
}

interface AuthState {
    accessToken: string | null,
    user: User | null,
    setAuth: (token: string, user: User) => void
    clearAuth: () => void
    updateUser: (partial: Partial<User>) => void
}

const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    user: null,
    setAuth: (token, user) => set({ accessToken: token, user }),
    clearAuth: () => set({ accessToken: null, user: null }),
    updateUser: (partial) =>
        set((state) => ({
            user: state.user ? { ...state.user, ...partial } : state.user,
        })),
}))

export default useAuthStore