import { CallHandler, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import { LoggingService } from '@core/logging';

import { Request, Response } from 'express';
import { DeepMockProxy, mock, mockDeep } from 'jest-mock-extended';
import { lastValueFrom, Observable, of } from 'rxjs';
import { Logger } from 'winston';

import { ApiResponse } from './api-response';
import { ApiResponseInterceptor } from './api-response.interceptor';

type TestResponse = {
  name: string;
};

describe('ApiResponseInterceptor Test Suite', () => {
  let mockConfigService: DeepMockProxy<ConfigService>;
  let mockLoggingService: DeepMockProxy<LoggingService>;
  let mockLogger: DeepMockProxy<Logger>;

  let sut: ApiResponseInterceptor<TestResponse>;

  // Nest setup
  beforeEach(async () => {
    mockConfigService = mockDeep<ConfigService>();

    mockLoggingService = mockDeep<LoggingService>();
    mockLogger = mockDeep<Logger>();

    mockLoggingService.getChildLogger.mockReturnValue(mockLogger);

    const module = await Test.createTestingModule({
      providers: [
        ApiResponseInterceptor,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: LoggingService,
          useValue: mockLoggingService,
        },
      ],
    }).compile();

    sut = module.get(ApiResponseInterceptor<TestResponse>);
  });

  let callHandler: DeepMockProxy<CallHandler<TestResponse>>;
  let context: DeepMockProxy<ExecutionContext>;

  // Mocks setup
  beforeEach(() => {
    const mockRequest = mockDeep<Request>({
      method: 'GET',
      originalUrl: '/test',
    });

    const mockResponse = mockDeep<Response>({
      req: mockRequest,
      statusCode: 200,
    });

    callHandler = mock<CallHandler<TestResponse>>();
    context = mock<ExecutionContext>({
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn().mockReturnValue(mockRequest),
        getResponse: jest.fn().mockReturnValue(mockResponse),
        getNext: jest.fn(),
      })),
    });

    callHandler.handle.mockReturnValue(of({ name: 'test name' }));
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('When request is made to non-excluded endpoint', () => {
    beforeEach(() => {
      mockConfigService.get.mockReturnValue([]);
    });

    it('should correctly format and send response', async () => {
      const expectedResponse: ApiResponse<TestResponse> = {
        data: { name: 'test name' },
        errors: [],
        method: 'GET',
        path: '/test',
        statusCode: 200,
        timestamp: expect.any(String), // Any timestamp string
      };

      const response = await lastValueFrom(
        sut.intercept(context, callHandler) as Observable<
          ApiResponse<TestResponse>
        >,
      );

      expect(response).toEqual(expectedResponse);
    });

    it('should log error details', async () => {
      await lastValueFrom(
        sut.intercept(context, callHandler) as Observable<
          ApiResponse<TestResponse>
        >,
      );

      expect(mockLogger.info).toHaveBeenCalledWith(
        'success',
        expect.objectContaining({
          statusCode: 200,
          path: '/test',
          method: 'GET',
        }),
      );
    });
  });

  describe('When request is made to excluded endpoint', () => {
    it('should not format response and instead return response untransformed', async () => {
      mockConfigService.get.mockReturnValueOnce(['test']);

      const expectedResponse: TestResponse = {
        name: 'test name',
      };

      const response = await lastValueFrom(
        sut.intercept(context, callHandler) as Observable<TestResponse>,
      );

      expect(response).toEqual(expectedResponse);
      expect(mockLogger.info).not.toHaveBeenCalled();
    });
  });
});
