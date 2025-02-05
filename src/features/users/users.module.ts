import { Module } from '@nestjs/common';

import { HttpModule } from '@core/http';
import { PersistenceModule } from '@core/persistence';

import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersHttpService } from './users-http.service';

@Module({
  imports: [HttpModule, PersistenceModule],
  controllers: [UsersController],
  providers: [UsersHttpService, UsersRepository],
})
export class UsersModule {}
