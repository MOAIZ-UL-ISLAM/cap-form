import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { AuthService } from '@/services/auth/auth.service';
import { useAuthStore } from '@/store/auth.store';
import type { LoginFormValues } from '@/schemas/auth/login.schema';
import type { AxiosError } from 'axios';
import type { ApiError } from '@/types/api.types';

export function useLogin() {
    const setAuth = useAuthStore(s => s.setAuth);
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (payload: LoginFormValues) => AuthService.login(payload),
        onSuccess: (res) => {
            if (res.data) {
                setAuth({ ...res.data });
                navigate('/dashboard');
            }
        },
        onError: (err: AxiosError<ApiError>) => {
            toast.error(err.response?.data?.message ?? 'Login failed');
        },
    });
}