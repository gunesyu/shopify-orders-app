import { Injectable } from '@nestjs/common';
import { ShopifyService } from './shopify/shopify.service';

@Injectable()
export class AppService {
  constructor(private readonly shopifyService: ShopifyService) {}

  async getHello() {
    return await this.shopifyService.checkInstallStatus({
      shop: 'yunus-dev-test-store.myshopify.com',
      accessToken: 'asdasd',
    });
  }
}
