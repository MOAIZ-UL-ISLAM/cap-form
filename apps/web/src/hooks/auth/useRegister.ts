import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { AuthService } from '@/services/auth/auth.service';
import type { RegisterFormValues } from '@/schemas/auth/register.schema';
import type { AxiosError } from 'axios';
import type { ApiError } from '@/types/api.types';

export function useRegister() {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: ({ confirmPassword: _, ...payload }: RegisterFormValues) =>
            AuthService.register(payload),
        onSuccess: () => {
            toast.success('Account created — check your email for credentials');
            navigate('/login?registered=1');
        },
        onError: (err: AxiosError<ApiError>) => {
            toast.error(err.response?.data?.message ?? 'Registration failed');
        },
    });
}