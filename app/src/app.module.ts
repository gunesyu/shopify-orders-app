import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CommonModule } from './common/common.module';
import { ShopifyModule } from './shopify/shopify.module';

@Module({
  imports: [CommonModule, ShopifyModule],
  controllers: [AppController],
})
export class AppModule {}
