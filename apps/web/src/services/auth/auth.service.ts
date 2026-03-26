import { apiClient } from '@/api/axios';
import type { ApiResponse } from '@/types/api.types';
import type { ActivateResponse, LoginResponse, RegisterResponse } from '@/types/auth.types';
import type { LoginFormValues } from '@/schemas/auth/login.schema';
import type { RegisterFormValues } from '@/schemas/auth/register.schema';

export const AuthService = {
    login: async (payload: LoginFormValues) => {
        const { data } = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', payload);
        return data;
    },

    register: async (payload: Omit<RegisterFormValues, 'confirmPassword'>) => {
        const { data } = await apiClient.post<ApiResponse<RegisterResponse>>('/auth/register', payload);
        return data;
    },

    activate: async (token: string) => {
        const { data } = await apiClient.get<ApiResponse<ActivateResponse>>(`/auth/activate?token=${token}`);
        return data;
    },

    setPassword: async (payload: { token: string; password: string }) => {
        const { data } = await apiClient.post<ApiResponse>('/auth/set-password', payload);
        return data;
    },
};