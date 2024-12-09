import { Module } from '@nestjs/common';
import { ShopifyRepository } from './shopify.repository';
import { ShopifyInstallController } from './shopify.install.controller';
import { ShopifyUtil } from './shopify.util';
import { ShopifyOrderService } from './shopify.order.service';
import { ShopifyOrderController } from './shopify.order.controller';
import { CommonModule } from '../common/common.module';
import { ShopifyService } from './shopify.service';
import { ShopifyInstallService } from './shopify.install.service';
import { ShopifyOrderRepository } from './shopify.order.repository';

@Module({
  imports: [CommonModule],
  providers: [
    ShopifyService,
    ShopifyRepository,
    ShopifyUtil,
    ShopifyInstallService,
    ShopifyOrderService,
    ShopifyOrderRepository,
  ],
  controllers: [ShopifyInstallController, ShopifyOrderController],
  exports: [ShopifyService, ShopifyInstallService, ShopifyOrderService],
})
export class ShopifyModule {}
