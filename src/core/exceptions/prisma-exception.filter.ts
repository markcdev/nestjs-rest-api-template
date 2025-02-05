import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

import { LoggingService } from '@core/logging';
import { ApiResponse } from '@core/response-mapping';
import { Prisma } from '@prisma/client';

import { HttpStatusCode } from 'axios';
import { Request, Response } from 'express';
import { match } from 'ts-pattern';
import { Logger } from 'winston';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private logger: Logger;

  constructor(private loggingService: LoggingService) {
    this.logger = this.loggingService.getChildLogger(
      PrismaExceptionFilter.name,
    );
  }

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const context = host.switchToHttp();

    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();

    const transformedResponse = this.toApiResponse(exception, request);

    this.logError(exception, transformedResponse);

    response.status(transformedResponse.statusCode).json(transformedResponse);
  }

  private logError(
    exception: Prisma.PrismaClientKnownRequestError,
    response: ApiResponse,
  ): void {
    this.logger.error(exception.message, {
      ...response,
      stack: exception.stack.replace(/\n/g, ' '),
    });
  }

  private toApiResponse = (
    exception: Prisma.PrismaClientKnownRequestError,
    request: Request,
  ): ApiResponse => ({
    data: null,
    errors: [exception.message.replace(/\n/g, '')],
    method: request.method,
    path: request.path,
    statusCode: this.prismaCodeToHttpStatus(exception.code),
    timestamp: new Date().toISOString(),
  });

  private prismaCodeToHttpStatus(prismaErrorCode: string): HttpStatusCode {
    return match(prismaErrorCode)
      .with('P2002', () => HttpStatusCode.Conflict)
      .otherwise(() => HttpStatusCode.InternalServerError);
  }
}
