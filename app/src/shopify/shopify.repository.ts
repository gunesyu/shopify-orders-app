import { PrismaService } from '../common/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ShopifyRepository {
  constructor(private prisma: PrismaService) {}
}
