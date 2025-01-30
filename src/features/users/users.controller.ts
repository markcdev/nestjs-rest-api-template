import { Controller, Get, Param } from '@nestjs/common';

import { HttpService } from '@core/http';

import { UserViewModel } from './user.vm';

@Controller({ path: 'users', version: '1.0' })
export class UsersController {
  constructor(private httpService: HttpService) {}

  @Get()
  async getUsers() {
    const { data } = await this.httpService
      .withBaseUrl('https://jsonplaceholder.typicode.com')
      .withMethod('GET')
      .withRoutePath('/users')
      .execute<UserViewModel>();

    return data;
  }

  @Get(':userId')
  async getUserById(@Param('userId') userId: string) {
    const { data } = await this.httpService
      .withBaseUrl('https://jsonplaceholder.typicode.com')
      .withMethod('GET')
      .withRoutePath(`/users/${userId}`)
      .execute<UserViewModel>();

    return data;
  }
}
