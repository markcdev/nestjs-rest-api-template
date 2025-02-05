import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { CreateUserDto } from './create-user.dto';
import { UsersRepository } from './users.repository';
import { UsersHttpService } from './users-http.service';

@Controller({ path: 'users', version: '1.0' })
export class UsersController {
  constructor(
    private usersHttpService: UsersHttpService,
    private usersRepository: UsersRepository,
  ) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    return this.usersRepository.createUser(dto);
  }

  @Get()
  async getUsers() {
    return this.usersHttpService.getAllUsers();
  }

  @Get(':userId')
  async getUserById(@Param('userId') userId: string) {
    // return this.usersHttpService.getUserById(userId);
    return this.usersHttpService.getUserById(userId);
  }
}
