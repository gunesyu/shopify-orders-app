import { Controller, Get, Query } from '@nestjs/common';
import { ShopifyOrderService } from './shopify.order.service';
import { GetOrdersDto } from './shopify.order.dto';

@Controller('shopify/order')
export class ShopifyOrderController {
  constructor(private shopifyOrderService: ShopifyOrderService) {}

  @Get()
  async getOrders(@Query() query?: GetOrdersDto) {
    return await this.shopifyOrderService.getOrders(query);
  }
}
