import { Injectable } from '@nestjs/common';
import { ShopifyService } from './shopify.service';
import { ShopifyOrderRepository } from './shopify.order.repository';
import { GetOrdersDto } from './shopify.order.dto';

const DEFAULT_SINCE = '2024-01-01';

@Injectable()
export class ShopifyOrderService {
  constructor(
    private readonly shopifyService: ShopifyService,
    private readonly shopifyOrderRepository: ShopifyOrderRepository,
  ) {}

  async getOrders(query: GetOrdersDto) {
    const { shop, refresh, since = DEFAULT_SINCE } = query;

    if (refresh) {
      return await this.refreshOrders(shop, since);
    }

    return await this.shopifyOrderRepository.getAll(shop, since);
  }

  async getOrdersFromShopify(shop: string, since = DEFAULT_SINCE) {
    const { client } = await this.shopifyService.getShopifyClient({
      url: shop,
    });

    const query = `#graphql
    query getOrders($first: Int, $after: String, $query: String) {
      orders(first: $first, after: $after, query: $query) {
        edges {
            cursor
            node {
                id
                name
                customer {
                    id
                    displayName
                    email
                }
                createdAt
                updatedAt
                totalPriceSet {
                    shopMoney {
                        amount
                        currencyCode
                    }
                }
            }
        }
        pageInfo {
            startCursor
            endCursor
            hasNextPage
            hasPreviousPage
        }
      }
    }
    `;

    const variables = {
      first: 10,
      query: `created_at:>${since}`,
    };

    try {
      const response = await client.request(query, {
        variables,
      });

      return response?.data?.orders?.edges?.map(({ node }) => node);
    } catch (error) {
      throw new Error(`Failed to fetch orders from Shopify: ${error}`);
    }
  }

  async refreshOrders(shopUrl: string, since = DEFAULT_SINCE) {
    const orders = await this.getOrdersFromShopify(shopUrl, since);

    return await this.shopifyOrderRepository.saveAll(shopUrl, orders);
  }
}
