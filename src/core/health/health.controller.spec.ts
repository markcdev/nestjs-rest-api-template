import { HealthCheckService, PrismaHealthIndicator } from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@core/persistence';

import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

import { HealthController } from './health.controller';

describe('HealthController', () => {
  let mockHealthCheckService: DeepMockProxy<HealthCheckService>;
  let mockPrismaHealthIndcator: DeepMockProxy<PrismaHealthIndicator>;
  let mockPrismaService: DeepMockProxy<PrismaService>;

  let sut: HealthController;

  beforeEach(async () => {
    mockHealthCheckService = mockDeep<HealthCheckService>();
    mockPrismaHealthIndcator = mockDeep<PrismaHealthIndicator>();
    mockPrismaService = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: mockHealthCheckService,
        },
        {
          provide: PrismaHealthIndicator,
          useValue: mockPrismaHealthIndcator,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    sut = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });
});
