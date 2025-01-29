import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class LoggingService {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private logger: Logger) {}

  getChildLogger(className: string): Logger {
    return this.logger.child({ context: className });
  }
}
