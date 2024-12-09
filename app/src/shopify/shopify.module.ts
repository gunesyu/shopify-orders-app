import { Module } from '@nestjs/common';
import { PrismaModule } from '../common/prisma/prisma.module';
import { ShopifyService } from './shopify.service';
import { ShopifyRepository } from './shopify.repository';
import { ShopifyController } from './shopify.controller';
import { ConfigService } from '@nestjs/config';
import { ShopifyUtil } from './shopify.util';

@Module({
  imports: [PrismaModule],
  providers: [ShopifyService, ShopifyRepository, ShopifyUtil, ConfigService],
  controllers: [ShopifyController],
  exports: [ShopifyService],
})
export class ShopifyModule {}
