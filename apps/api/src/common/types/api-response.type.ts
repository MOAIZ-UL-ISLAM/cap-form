// apps/api/src/common/types/api-response.type.ts
export interface ApiResponse<T = null> {
    success: boolean;
    message: string;
    data: T | null;
    timestamp: string;
}