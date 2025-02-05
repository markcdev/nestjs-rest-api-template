import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { LoggingService } from '@core/logging';
import { ApiResponse } from '@core/response-mapping';
import { Prisma } from '@prisma/client';

import { Request, Response } from 'express';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { Logger } from 'winston';

import { PrismaExceptionFilter } from './prisma-exception.filter';

describe('PrismaExceptionFilter', () => {
  let mockLoggingService: DeepMockProxy<LoggingService>;
  let mockLogger: DeepMockProxy<Logger>;

  let sut: PrismaExceptionFilter;

  // Nest setup
  beforeEach(async () => {
    mockLoggingService = mockDeep<LoggingService>();
    mockLogger = mockDeep<Logger>();

    mockLoggingService.getChildLogger.mockReturnValue(mockLogger);

    const module = await Test.createTestingModule({
      providers: [
        PrismaExceptionFilter,
        {
          provide: LoggingService,
          useValue: mockLoggingService,
        },
      ],
    }).compile();

    sut = module.get<PrismaExceptionFilter>(PrismaExceptionFilter);
  });

  let mockHost: DeepMockProxy<ArgumentsHost>;
  let mockRequest: DeepMockProxy<Request>;
  let mockResponse: DeepMockProxy<Response>;

  // Mocks setup
  beforeEach(() => {
    mockRequest = mockDeep<Request>({
      method: 'GET',
      path: '/test',
    });

    mockResponse = mockDeep<Response>();
    mockResponse.status.mockReturnThis(); // Makes .status() chainable

    mockHost = mockDeep<ArgumentsHost>({
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn().mockReturnValue(mockRequest),
        getResponse: jest.fn().mockReturnValue(mockResponse),
        getNext: jest.fn(),
      })),
    });
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should correctly format and send response when prisma error code can be mapped', () => {
    const exception = new Prisma.PrismaClientKnownRequestError('Test error', {
      code: 'P2002',
      clientVersion: '1.0.0',
    });

    const expectedResponse: ApiResponse = {
      data: null,
      errors: ['Test error'],
      method: 'GET',
      path: '/test',
      statusCode: 409,
      timestamp: expect.any(String), // Any timestamp string
    };

    sut.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
  });

  it('should map internal server error response when prisma error code is not mappable', () => {
    const exception = new Prisma.PrismaClientKnownRequestError('Test error', {
      code: 'UNKNOWN_PRISMA_CODE',
      clientVersion: '1.0.0',
    });

    const expectedResponse: ApiResponse = {
      data: null,
      errors: ['Test error'],
      method: 'GET',
      path: '/test',
      statusCode: 500,
      timestamp: expect.any(String), // Any timestamp string
    };

    sut.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
  });

  it('should log error details', () => {
    const exception = new Prisma.PrismaClientKnownRequestError('Test error', {
      code: 'UNKNOWN_PRISMA_CODE',
      clientVersion: '1.0.0',
    });

    sut.catch(exception, mockHost);

    expect(mockLogger.error).toHaveBeenCalledWith(
      'Test error',
      expect.objectContaining({
        errors: ['Test error'],
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        path: '/test',
        method: 'GET',
        stack: exception.stack.replace(/\n/g, ' '),
      }),
    );
  });
});
