// src/common/middleware/request-logger.middleware.ts
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const start = Date.now();
    const requestId = req.headers['x-request-id'] || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    // Log request start
    this.logger.log(`[${requestId}] ${method} ${originalUrl} - START`);

    // Capture response finish
    res.on('finish', () => {
      const duration = Date.now() - start;
      const { statusCode } = res;
      const contentLength = res.get('content-length') || 0;

      const logMessage = `[${requestId}] ${method} ${originalUrl} ${statusCode} ${duration}ms ${contentLength}b`;

      if (statusCode >= 500) {
        this.logger.error(logMessage);
      } else if (statusCode >= 400) {
        this.logger.warn(logMessage);
      } else if (duration > 1000) {
        this.logger.warn(`${logMessage} [SLOW]`);
      } else {
        this.logger.log(logMessage);
      }
    });

    next();
  }
}
