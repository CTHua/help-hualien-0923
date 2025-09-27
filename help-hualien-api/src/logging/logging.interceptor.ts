import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const { originalUrl, method, headers, params, query, body } = context
      .switchToHttp()
      .getRequest();

    // 把 headers中的authorization拿掉
    if (headers) {
      delete headers.authorization;
    }

    const { statusCode } = context.switchToHttp().getResponse();
    Logger.log(
      JSON.stringify({
        method,
        headers,
        params,
        query,
        body,
        originalUrl,
      }),
      originalUrl,
    );
    return next.handle().pipe(
      catchError((err) => {
        Logger.warn(
          JSON.stringify({
            responseTime: Date.now() - now,
            err,
          }),
          `${originalUrl}`,
        );
        return throwError(() => err);
      }),
      tap((data) => {
        Logger.log(
          JSON.stringify({
            statusCode,
            responseTime: Date.now() - now,
            data,
          }),
          originalUrl,
        );
      }),
    );
  }
}
