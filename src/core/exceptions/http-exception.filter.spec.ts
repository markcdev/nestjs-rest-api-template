import { Test } from '@nestjs/testing';

import { LoggingService } from '@core/logging';

import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

import { HttpExceptionFilter } from './http-exception.filter';

describe('HttpExceptionFilter', () => {
  let mockLoggingService: DeepMockProxy<LoggingService>;

  let sut: HttpExceptionFilter;

  beforeEach(async () => {
    mockLoggingService = mockDeep<LoggingService>();

    const module = await Test.createTestingModule({
      providers: [
        HttpExceptionFilter,
        { provide: LoggingService, useValue: mockLoggingService },
      ],
    }).compile();

    sut = module.get<HttpExceptionFilter>(HttpExceptionFilter);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });
});
