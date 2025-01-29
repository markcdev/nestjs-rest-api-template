import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { LoggingService } from '@core/logging';
import { ApiResponse } from '@core/response-mapping';

import { Request, Response } from 'express';
import { Logger } from 'winston';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger: Logger;

  constructor(private loggingService: LoggingService) {
    this.logger = this.loggingService.getChildLogger(HttpExceptionFilter.name);
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();

    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();

    const transformedResponse = this.toApiResponse(exception, request);

    this.logError(exception, transformedResponse);

    response.status(exception.getStatus()).json(transformedResponse);
  }

  private logError(exception: HttpException, response: ApiResponse): void {
    this.logger.error(exception.message, {
      ...response,
      stack: exception.stack,
    });
  }

  private toApiResponse = (
    exception: HttpException,
    request: Request,
  ): ApiResponse => ({
    data: null,
    errors: [exception.message],
    method: request.method,
    path: request.path,
    statusCode: exception.getStatus(),
    timestamp: new Date().toISOString(),
  });
}
