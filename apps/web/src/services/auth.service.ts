// apps/web/src/services/auth.service.ts
import { apiClient } from '@/api/axios';
import type { ApiResponse } from '@/types/api.types';
import type { LoginPayload, LoginResponse, RegisterPayload } from '@/types/auth.types';

export const AuthService = {
    register: async (payload: RegisterPayload): Promise<ApiResponse> => {
        const { data } = await apiClient.post<ApiResponse>('/auth/register', payload);
        return data;
    },

    login: async (payload: LoginPayload): Promise<ApiResponse<LoginResponse>> => {
        const { data } = await apiClient.post<ApiResponse<LoginResponse>>(
            '/auth/login',
            payload,
        );
        return data;
    },
};