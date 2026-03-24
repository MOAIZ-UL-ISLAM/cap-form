// apps/web/src/hooks/useLogin.ts
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useAuthStore } from '@/store/auth.store';
import { AuthService } from '@/services/auth.service';
import type { LoginPayload } from '@/types/auth.types';
import type { ApiError } from '@/types/api.types';

export const useLogin = () => {
    const setAuth = useAuthStore((s) => s.setAuth);

    return useMutation({
        mutationFn: (payload: LoginPayload) => AuthService.login(payload),
        onSuccess: (res) => {
            if (res.data) {
                setAuth({ userId: res.data.userId, accessToken: res.data.accessToken });
            }
        },
        onError: (error: AxiosError<ApiError>) => {
            console.error('Login failed:', error.response?.data?.message);
        },
    });
};