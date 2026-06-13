// src/common/interceptors/sanitize.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Global XSS sanitization interceptor.
 * Strips HTML/script tags from all string values in request body, query, and response.
 */
@Injectable()
export class SanitizeInterceptor implements NestInterceptor {
  // Matches any HTML tag, script, event handler, or javascript: URL
  private readonly xssPattern = /<[^>]*>|javascript:|on\w+\s*=|&#x?[0-9a-f]+;|%3C|%3E/gi;

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // Sanitize request body (clone to avoid mutating read-only properties)
    if (request.body && typeof request.body === 'object') {
      try {
        request.body = this.sanitizeObject({ ...request.body });
      } catch {
        // ignore if body is not writable
      }
    }

    // Sanitize query params
    if (request.query && typeof request.query === 'object') {
      try {
        request.query = this.sanitizeObject({ ...request.query });
      } catch {
        // ignore if query is not writable
      }
    }

    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object') {
          return this.sanitizeObject(data);
        }
        return data;
      }),
    );
  }

  private sanitizeString(value: string): string {
    return value
      .replace(this.xssPattern, '')
      .replace(/[<>]/g, '') // Remove any remaining angle brackets
      .trim();
  }

  private sanitizeObject(obj: any): any {
    if (typeof obj === 'string') {
      return this.sanitizeString(obj);
    }
    if (Array.isArray(obj)) {
      return obj.map((item) => this.sanitizeObject(item));
    }
    if (obj && typeof obj === 'object') {
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        result[key] = this.sanitizeObject(value);
      }
      return result;
    }
    return obj;
  }
}
