import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { LoggingService } from '@core/logging';
import { ApiResponse } from '@core/response-mapping';

import { Request, Response } from 'express';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { Logger } from 'winston';

import { HttpExceptionFilter } from './http-exception.filter';

describe('HttpExceptionFilter', () => {
  let mockLoggingService: DeepMockProxy<LoggingService>;
  let mockLogger: DeepMockProxy<Logger>;

  let sut: HttpExceptionFilter;

  // Nest setup
  beforeEach(async () => {
    mockLoggingService = mockDeep<LoggingService>();
    mockLogger = mockDeep<Logger>();

    mockLoggingService.getChildLogger.mockReturnValue(mockLogger);

    const module = await Test.createTestingModule({
      providers: [
        HttpExceptionFilter,
        { provide: LoggingService, useValue: mockLoggingService },
      ],
    }).compile();

    sut = module.get<HttpExceptionFilter>(HttpExceptionFilter);
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

  it('should correctly format and send response', () => {
    const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);

    const expectedResponse: ApiResponse = {
      data: null,
      errors: ['Test error'],
      method: 'GET',
      path: '/test',
      statusCode: 400,
      timestamp: expect.any(String), // Any timestamp string
    };

    sut.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
  });

  it('should log error details', () => {
    const exception = new HttpException('Test error', HttpStatus.NOT_FOUND);

    sut.catch(exception, mockHost);

    expect(mockLogger.error).toHaveBeenCalledWith(
      'Test error',
      expect.objectContaining({
        errors: ['Test error'],
        statusCode: HttpStatus.NOT_FOUND,
        path: '/test',
        method: 'GET',
        stack: exception.stack,
      }),
    );
  });
});
