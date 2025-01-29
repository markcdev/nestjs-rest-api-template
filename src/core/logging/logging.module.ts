import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';

import { loggingModuleOptions } from './logging.module-options';
import { LoggingService } from './logging.service';

@Module({
  imports: [WinstonModule.forRoot(loggingModuleOptions)],
  providers: [LoggingService],
  exports: [LoggingService],
})
export class LoggingModule {}
