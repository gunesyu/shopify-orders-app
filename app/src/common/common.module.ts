import { Global, Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from './config/config.module';

@Global()
@Module({
  imports: [ConfigModule, PrismaModule],
  exports: [ConfigModule, PrismaModule],
})
export class CommonModule {}
