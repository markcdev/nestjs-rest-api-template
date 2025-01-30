import { Provider } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { HttpExceptionFilter } from '@core/exceptions';
import { ApiResponseInterceptor } from '@core/response-mapping';

export const appProviders: Provider[] = [
  {
    provide: APP_INTERCEPTOR,
    useClass: ApiResponseInterceptor,
  },
  {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter,
  },
];
