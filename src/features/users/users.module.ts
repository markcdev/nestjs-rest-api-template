import { Module } from '@nestjs/common';

import { HttpModule } from '@core/http';

import { UsersController } from './users.controller';

@Module({
  imports: [HttpModule],
  controllers: [UsersController],
})
export class UsersModule {}
