// apps/web/src/hooks/useRegister.ts
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { AuthService } from '@/services/auth.service';
import type { RegisterPayload } from '@/types/auth.types';
import type { ApiError } from '@/types/api.types';

export const useRegister = () => {
    return useMutation({
        mutationFn: (payload: RegisterPayload) => AuthService.register(payload),
        onError: (error: AxiosError<ApiError>) => {
            console.error('Registration failed:', error.response?.data?.message);
        },
    });
};