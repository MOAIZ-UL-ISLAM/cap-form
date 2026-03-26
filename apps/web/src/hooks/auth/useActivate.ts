import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AuthService } from '@/services/auth/auth.service';
import type { AxiosError } from 'axios';
import type { ApiError } from '@/types/api.types';

export function useActivate() {
    return useMutation({
        mutationFn: (token: string) => AuthService.activate(token),
        onError: (err: AxiosError<ApiError>) => {
            toast.error(err.response?.data?.message ?? 'Activation failed');
        },
    });
}