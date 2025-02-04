import { Module } from '@nestjs/common';

import { HttpModule } from '@core/http';

import { UsersController } from './users.controller';
import { UsersHttpService } from './users-http.service';

@Module({
  imports: [HttpModule],
  controllers: [UsersController],
  providers: [UsersHttpService],
})
export class UsersModule {}
