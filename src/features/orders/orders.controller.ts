import { Controller, Get } from '@nestjs/common';

@Controller({ path: 'orders', version: 'V1.0' })
export class OrdersController {
  @Get()
  getOrders() {
    return [];
  }
}
