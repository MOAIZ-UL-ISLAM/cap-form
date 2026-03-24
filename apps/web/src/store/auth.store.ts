// apps/web/src/store/auth.store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthUser } from '@/types/auth.types';

interface AuthState {
    user: AuthUser | null;
    accessToken: string | null;
    setAuth: (user: AuthUser) => void;
    clearAuth: () => void;
    isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            setAuth: (user) => set({ user, accessToken: user.accessToken }),
            clearAuth: () => set({ user: null, accessToken: null }),
            isAuthenticated: () => !!get().accessToken,
        }),
        {
            name: 'tigcap-auth',
            storage: createJSONStorage(() => sessionStorage), // sessionStorage for security
        },
    ),
);