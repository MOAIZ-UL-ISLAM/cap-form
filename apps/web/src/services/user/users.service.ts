import { apiClient } from '@/api/axios';
import type { ApiResponse } from '@/types/api.types';
import type { User } from '@/types/user.types';
import type { CreateUserFormValues } from '@/schemas/user/create-user.schema';
import type { UpdateUserFormValues } from '@/schemas/user/update-user.schema';

export const UserService = {
    list: async () => {
        const { data } = await apiClient.get<ApiResponse<User[]>>('/users');
        return data;
    },

    getOne: async (userId: string) => {
        const { data } = await apiClient.get<ApiResponse<User>>(`/users/${userId}`);
        return data;
    },

    create: async (payload: CreateUserFormValues) => {
        const { data } = await apiClient.post<ApiResponse>('/users', payload);
        return data;
    },

    update: async (userId: string, payload: UpdateUserFormValues) => {
        const { data } = await apiClient.patch<ApiResponse>(`/users/${userId}`, payload);
        return data;
    },

    remove: async (userId: string) => {
        const { data } = await apiClient.delete<ApiResponse>(`/users/${userId}`);
        return data;
    },

    getAuditLogs: async () => {
        const { data } = await apiClient.get<ApiResponse>('/users/admin/audit-logs');
        return data;
    },
};