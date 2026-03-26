import { useQuery } from '@tanstack/react-query';
import { UserService } from '@/services/user/users.service';

export const USERS_KEY = ['users'] as const;

export function useUsers() {
    return useQuery({
        queryKey: USERS_KEY,
        queryFn: () => UserService.list(),
        select: res => res.data ?? [],
    });
}