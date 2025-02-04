import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  PrismaHealthIndicator,
} from '@nestjs/terminus';

import { PrismaService } from '@core/persistence';

@Controller({ path: 'health', version: '1.0' })
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prismaHealthIndicator: PrismaHealthIndicator,
    private prismaService: PrismaService,
  ) {}

  @Get()
  @HealthCheck()
  async healthCheck() {
    return this.health.check([
      async () =>
        this.prismaHealthIndicator.pingCheck('prisma', this.prismaService),
    ]);
  }
}
