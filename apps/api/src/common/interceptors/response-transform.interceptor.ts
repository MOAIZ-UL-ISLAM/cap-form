// apps/api/src/common/interceptors/response-transform.interceptor.ts
import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../types/api-response.type';

@Injectable()
export class ResponseTransformInterceptor<T>
    implements NestInterceptor<T, ApiResponse<T>>
{
    intercept(
        _context: ExecutionContext,
        next: CallHandler,
    ): Observable<ApiResponse<T>> {
        return next.handle().pipe(
            map((data) => ({
                success: true,
                message: data?.message ?? 'Success',
                data: data?.data ?? data ?? null,
                timestamp: new Date().toISOString(),
            })),
        );
    }
}