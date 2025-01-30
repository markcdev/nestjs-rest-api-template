import { Test } from '@nestjs/testing';

import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { LoggingService } from './logging.service';

describe('Logging Test suite', () => {
  let sut: LoggingService;
  let mockedWinstonLogger: DeepMockProxy<Logger>;

  beforeEach(async () => {
    mockedWinstonLogger = mockDeep<Logger>();

    const module = await Test.createTestingModule({
      providers: [
        LoggingService,
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: mockedWinstonLogger,
        },
      ],
    }).compile();

    sut = module.get<LoggingService>(LoggingService);
    mockedWinstonLogger = module.get(WINSTON_MODULE_PROVIDER);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should call child logger with expected name', () => {
    const expectedName = 'MyTestClass';

    sut.getChildLogger(expectedName);

    expect(mockedWinstonLogger.child).toHaveBeenCalledWith({
      context: expectedName,
    });
  });
});
