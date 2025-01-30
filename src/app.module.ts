import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { configModuleOptions } from '@core/config';
import { LoggingModule } from '@core/logging';
import { OrdersModule } from '@features/orders';
import { UsersModule } from '@features/users';

import { appProviders } from './app.providers';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    LoggingModule,
    OrdersModule,
    UsersModule,
  ],
  providers: [...appProviders],
})
export class AppModule {}
