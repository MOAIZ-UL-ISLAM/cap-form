// apps/web/src/types/api.types.ts
export interface ApiResponse<T = null> {
    success: boolean;
    message: string;
    data: T | null;
    timestamp: string;
}

export interface ApiError {
    success: false;
    message: string;
    data: null;
    timestamp: string;
}