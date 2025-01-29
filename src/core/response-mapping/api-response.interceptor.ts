import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggingService } from '@core/logging';

import { Request, Response } from 'express';
import { map, tap } from 'rxjs';
import { Logger } from 'winston';

import { ApiResponse } from './api-response';

type ApiInterceptorResponse<TData> = ApiResponse<TData> | TData;

@Injectable()
export class ApiResponseInterceptor<TData>
  implements NestInterceptor<TData, ApiInterceptorResponse<TData>>
{
  private logger: Logger;

  constructor(
    private configService: ConfigService,
    private loggingService: LoggingService,
  ) {
    this.logger = this.loggingService.getChildLogger(
      ApiResponseInterceptor.name,
    );
  }

  intercept(context: ExecutionContext, next: CallHandler<TData>) {
    const response = context.switchToHttp().getResponse<Response>();
    const { req, statusCode } = response;

    // dont transform excluded endpoints like health and readiness
    if (this.isExcludedEndpoint(req.originalUrl)) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => this.toApiResponse(data, req, statusCode)),
      tap(() => this.logResponse(req, statusCode)),
    );
  }

  private isExcludedEndpoint(requestUrl: string): boolean {
    const toExclude = this.configService.get<string[]>('EXCLUDED_ENDPOINTS');
    return toExclude.some((ep) => requestUrl.includes(ep));
  }

  private logResponse(request: Request, statusCode: number): void {
    this.logger.info('success', {
      path: request.originalUrl,
      method: request.method,
      statusCode,
    });
  }

  private toApiResponse = <TData>(
    data: TData,
    request: Request,
    statusCode: number,
  ): ApiResponse<TData> => ({
    data,
    path: request.originalUrl,
    method: request.method,
    errors: [],
    statusCode,
    timestamp: new Date().toISOString(),
  });
}
