import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthUser } from '@/types/auth.types';

interface AuthState {
    user: AuthUser | null;
    setAuth: (user: AuthUser) => void;
    clearAuth: () => void;
    isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            setAuth: (user) => set({ user }),
            clearAuth: () => set({ user: null }),
            isAuthenticated: () => !!get().user?.accessToken,
        }),
        {
            name: 'tigcap-auth',
            storage: createJSONStorage(() => sessionStorage),
        },
    ),
);