import { CallHandler, Injectable, NestInterceptor } from '@nestjs/common';
import { type Observable, map } from 'rxjs';
import { instanceToPlain } from 'class-transformer';

export interface Response<T> {
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: any, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        return data?.data
          ? {
              ...data,
              data:
                typeof data.data === 'object'
                  ? this.transformResponse(data.data)
                  : data.data,
            }
          : {
              data:
                typeof data === 'object' ? this.transformResponse(data) : data,
            };
      }),
    );
  }

  private transformResponse(response) {
    if (Array.isArray(response)) {
      return response.map((item) => this.transformToPlain(item));
    }

    return this.transformToPlain(response);
  }

  private transformToPlain(plainOrClass) {
    return plainOrClass && plainOrClass.constructor !== Object
      ? instanceToPlain(plainOrClass)
      : plainOrClass;
  }
}
