import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { PersistenceModule } from '@core/persistence';

import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
  imports: [PersistenceModule, TerminusModule],
})
export class HealthModule {}
