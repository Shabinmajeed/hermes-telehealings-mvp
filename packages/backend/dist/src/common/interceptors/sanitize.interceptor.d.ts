import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class SanitizeInterceptor implements NestInterceptor {
    private readonly xssPattern;
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private sanitizeString;
    private sanitizeObject;
}
