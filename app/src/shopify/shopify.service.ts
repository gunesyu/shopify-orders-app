import { Injectable, Logger } from '@nestjs/common';
import { ShopifyRepository } from './shopify.repository';
import '@shopify/shopify-api/adapters/node';
import {
  Shopify,
  shopifyApi,
  ApiVersion,
  LogSeverity,
} from '@shopify/shopify-api';
import { ConfigService } from '@nestjs/config';
import { Shop } from '@prisma/client';

@Injectable()
export class ShopifyService {
  private readonly shopifyInstance: Shopify;

  constructor(
    private shopifyRepository: ShopifyRepository,
    private readonly configService: ConfigService,
  ) {
    this.shopifyInstance = shopifyApi({
      apiKey: this.configService.get('SHOPIFY_API_CLIENT_ID'),
      apiSecretKey: this.configService.get('SHOPIFY_API_CLIENT_SECRET'),
      hostName: this.configService.get('SHOPIFY_APP_BASE_URL'),
      apiVersion: ApiVersion.October24,
      isEmbeddedApp: false,
      logger: {
        level: LogSeverity.Info,
        timestamps: true,
        httpRequests: true,
        log: async (severity, message) => {
          Logger.log(message, 'ShopifyApi');
        },
      },
    });
  }

  getShopifyInstance() {
    return this.shopifyInstance;
  }

  getShopifySession(shop: string) {
    const shopify = this.getShopifyInstance();

    return shopify.session.customAppSession(shop);
  }

  async getShopifyClient(shop: Partial<Shop>) {
    const existingShop = await this.shopifyRepository.getOneShopByUrl(shop.url);
    if (existingShop) {
      shop = existingShop;
    }

    const shopify = this.getShopifyInstance();
    const session = this.getShopifySession(shop.url);

    session.accessToken = shop.token;

    const client = new shopify.clients.Graphql({ session });

    return { client, session };
  }

  async getShopInfo(shop: Partial<Shop>) {
    const { client } = await this.getShopifyClient(shop);

    const query = `#graphql
      query getInfo {
        shop {
          id
          name
          url
          myshopifyDomain
          email
          currencyCode
          plan {
            displayName
            partnerDevelopment
            shopifyPlus
          }
        }
      }
    `;

    const response = await client.request(query);

    return response?.data?.shop;
  }
}
