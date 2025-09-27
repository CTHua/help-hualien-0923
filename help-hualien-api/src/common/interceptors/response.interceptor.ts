
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse } from '../dto/api-response.dto';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T> | any> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
      })),
      catchError((err) => {
        const response = {
          success: false,
          error: {
            code:
              err instanceof HttpException
                ? String(err.getStatus())
                : 'INTERNAL_SERVER_ERROR',
            message: err.response?.message || err.message,
          },
        };

        return throwError(
          () =>
            new HttpException(
              response,
              err instanceof HttpException
                ? err.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR,
            ),
        );
      }),
    );
  }
}
