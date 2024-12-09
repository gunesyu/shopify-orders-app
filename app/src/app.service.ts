import { Injectable } from '@nestjs/common';
import { ShopifyService } from './shopify/shopify.service';

@Injectable()
export class AppService {
  constructor(private readonly shopifyService: ShopifyService) {}

  async getHello(shop: string) {
    return await this.shopifyService.checkInstallStatus({ url: shop });
  }
}
