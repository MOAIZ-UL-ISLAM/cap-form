import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { AuthService } from '@/services/auth/auth.service';
import type { AxiosError } from 'axios';
import type { ApiError } from '@/types/api.types';

export function useSetPassword() {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (payload: { token: string; password: string }) =>
            AuthService.setPassword(payload),
        onSuccess: () => {
            toast.success('Password set — you can now log in');
            navigate('/login?activated=1');
        },
        onError: (err: AxiosError<ApiError>) => {
            toast.error(err.response?.data?.message ?? 'Failed to set password');
        },
    });
}