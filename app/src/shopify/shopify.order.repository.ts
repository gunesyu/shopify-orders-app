import { PrismaService } from '../common/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ShopifyOrderRepository {
  constructor(private prisma: PrismaService) {}

  async getShop(shopUrl: string) {
    return await this.prisma.shop.findUnique({
      where: {
        url: shopUrl,
      },
    });
  }

  async getAll(shopUrl: string, since: string) {
    const shop = await this.getShop(shopUrl);

    return this.prisma.order.findMany({
      where: {
        shopId: shop.id,
        createdAt: {
          gte: new Date(since),
        },
      },
      include: {
        customer: true,
      },
    });
  }

  async saveAll(shopUrl: string, orders) {
    const shop = await this.getShop(shopUrl);

    try {
      const customers = orders.map((order) => ({
        customerId: order.customer.id,
        name: order.customer.displayName,
        email: order.customer.email,
      }));

      return await this.prisma.$transaction(async (prisma) => {
        // create customers but don't use result directly
        // as some customers may already exist
        await prisma.customer.createMany({
          data: customers,
          skipDuplicates: true,
        });

        const createdCustomers = await prisma.customer.findMany({
          where: {
            customerId: {
              in: customers.map(({ customerId }) => customerId),
            },
          },
        });

        const ordersDto = orders.map((order) => ({
          orderId: order.id,
          shopId: shop.id,
          customerId: createdCustomers.find(
            ({ customerId }) => customerId === order.customer.id,
          ).id,
          total: Number(order.totalPriceSet.shopMoney.amount),
          currency: order.totalPriceSet.shopMoney.currencyCode,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        }));

        // create customers but don't use result directly
        // as some customers may already exist
        await prisma.order.createManyAndReturn({
          data: ordersDto,
          skipDuplicates: true,
        });

        return prisma.order.findMany({
          where: {
            orderId: {
              in: ordersDto.map(({ orderId }) => orderId),
            },
          },
          include: {
            customer: true,
          },
        });
      });
    } catch (error) {
      console.error(error);
      throw new Error('Error creating orders');
    }
  }
}
