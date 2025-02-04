import { Controller, Get, Param } from '@nestjs/common';

import { UsersHttpService } from './users-http.service';

@Controller({ path: 'users', version: '1.0' })
export class UsersController {
  constructor(private usersHttpService: UsersHttpService) {}

  @Get()
  async getUsers() {
    return this.usersHttpService.getAllUsers();
  }

  @Get(':userId')
  async getUserById(@Param('userId') userId: string) {
    return this.usersHttpService.getUserById(userId);
  }
}
