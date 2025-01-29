import { HttpModule as AxiosHttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { HttpService } from './http.service';

@Module({
  imports: [AxiosHttpModule],
  providers: [HttpService],
  exports: [HttpService],
})
export class HttpModule {}
