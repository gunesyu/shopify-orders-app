import { Logger } from '@nestjs/common';
import { PrismaClient as DefaultPrismaClient } from '@prisma/client';
import { PaginationExtension } from './prisma.extensions';

export class PrismaClient extends DefaultPrismaClient {
  constructor(options?: any) {
    super({
      ...(!!options ? options : {}),
      log: [
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'query',
        },
      ],
    });

    this.$on('info' as never, (e: any) => {
      Logger.log(e.message, 'PrismaInfo');
    });

    this.$on('query' as never, (e) => {
      Logger.log(JSON.stringify(e), 'PrismaQuery');
    });

    const prisma = PaginationExtension(this);

    return prisma as this;
  }
}
