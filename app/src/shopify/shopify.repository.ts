import { PrismaService } from '../common/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateShopifyShopDto } from './shopify.dto';

@Injectable()
export class ShopifyRepository {
  constructor(private prisma: PrismaService) {}

  async getOneByUrl(url: string) {
    return this.prisma.shop.findFirst({
      where: {
        url,
      },
    });
  }

  async create(dto: CreateShopifyShopDto) {
    const { email, url, name, token } = dto;

    try {
      return this.prisma.shop.create({
        data: {
          email,
          url,
          name,
          token,
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error('Error creating shop');
    }
  }
}
