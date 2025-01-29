import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { LoggingService } from '@core/logging';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'fatal', 'warn'],
  });

  const configService = app.get<ConfigService>(ConfigService);
  const servicePort = configService.get('SERVICE_PORT');

  const loggingService = app.get<LoggingService>(LoggingService);
  const appLogger = loggingService.getChildLogger('main.ts');

  appLogger.info(`running on port:${servicePort}`);

  await app.listen(3000);
}

bootstrap();
