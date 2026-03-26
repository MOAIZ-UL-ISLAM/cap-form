import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { UserService } from '@/services/user/users.service';
import { USERS_KEY } from './useUsers';
import type { CreateUserFormValues } from '@/schemas/user/create-user.schema';
import type { AxiosError } from 'axios';
import type { ApiError } from '@/types/api.types';

export function useCreateUser() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateUserFormValues) => UserService.create(payload),
        onSuccess: (res) => {
            qc.invalidateQueries({ queryKey: USERS_KEY });
            toast.success(res.message ?? 'User created successfully');
        },
        onError: (err: AxiosError<ApiError>) => {
            toast.error(err.response?.data?.message ?? 'Failed to create user');
        },
    });
}