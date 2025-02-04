import { Injectable } from '@nestjs/common';

import { HttpService } from '@core/http';

import { UserViewModel } from './user.vm';

@Injectable()
export class UsersHttpService {
  readonly baseUrl = 'https://jsonplaceholder.typicode.com';

  constructor(private httpService: HttpService) {}

  async getAllUsers(): Promise<UserViewModel[]> {
    const { data } = await this.httpService
      .withBaseUrl(this.baseUrl)
      .withMethod('GET')
      .withRoutePath('/users')
      .execute<UserViewModel[]>();

    return data;
  }

  async getUserById(userId: string): Promise<UserViewModel> {
    const { data } = await this.httpService
      .withBaseUrl(this.baseUrl)
      .withMethod('GET')
      .withRoutePath(`/users/${userId}`)
      .execute<UserViewModel>();

    return data;
  }
}
