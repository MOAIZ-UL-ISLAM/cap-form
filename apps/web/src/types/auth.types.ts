import type { Role } from "./user.types";

export interface AuthUser {
    userId: string;
    email: string;
    role: Role;
    accessToken: string;
}

export interface LoginResponse {
    accessToken: string;
    userId: string;
    email: string;
    role: Role;
}

export interface RegisterResponse {
    userId: string;
    message: string;
}

export interface ActivateResponse {
    message: string;
    token: string;
}