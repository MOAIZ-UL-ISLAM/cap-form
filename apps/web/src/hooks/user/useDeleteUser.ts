import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { UserService } from '@/services/user/users.service';
import { USERS_KEY } from './useUsers';
import type { AxiosError } from 'axios';
import type { ApiError } from '@/types/api.types';

export function useDeleteUser() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => UserService.remove(userId),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: USERS_KEY });
            toast.success('User deleted');
        },
        onError: (err: AxiosError<ApiError>) => {
            toast.error(err.response?.data?.message ?? 'Failed to delete user');
        },
    });
}