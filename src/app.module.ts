import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { configModuleOptions } from '@core/config';
import { HealthModule } from '@core/health';
import { LoggingModule } from '@core/logging';
import { PersistenceModule } from '@core/persistence';
import { OrdersModule } from '@features/orders';
import { UsersModule } from '@features/users';

import { appProviders } from './app.providers';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    HealthModule,
    LoggingModule,
    OrdersModule,
    PersistenceModule,
    UsersModule,
  ],
  providers: [...appProviders],
})
export class AppModule {}
