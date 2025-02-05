import { Provider, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { HttpExceptionFilter, PrismaExceptionFilter } from '@core/exceptions';
import { ApiResponseInterceptor } from '@core/response-mapping';

export const appProviders: Provider[] = [
  {
    provide: APP_PIPE,
    useFactory: () => new ValidationPipe({ transform: true, whitelist: true }),
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: ApiResponseInterceptor,
  },
  {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter,
  },
  {
    provide: APP_FILTER,
    useClass: PrismaExceptionFilter,
  },
];
