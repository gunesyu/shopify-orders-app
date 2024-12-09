import { Injectable, Logger } from '@nestjs/common';
import { ShopifyRepository } from './shopify.repository';
import '@shopify/shopify-api/adapters/node';
import {
  Shopify,
  shopifyApi,
  ApiVersion,
  LogSeverity,
} from '@shopify/shopify-api';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

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

  async getShopifyInstance() {
    return this.shopifyInstance;
  }

  async getShopifyClient(user: any) {
    const shopify = await this.getShopifyInstance();

    const session = shopify.session.customAppSession(user.shop);
    session.accessToken = user.shopifyToken;

    const client = new shopify.clients.Graphql({ session });

    return client;
  }

  async handleInstall(shop: string, req: Request, res: Response) {
    const shopify = await this.getShopifyInstance();

    return await shopify.auth.begin({
      shop: shopify.utils.sanitizeShop(shop, true),
      callbackPath: '/shopify/redirect',
      isOnline: false,
      rawRequest: req,
      rawResponse: res,
    });
  }

  async handleInstallRedirect(req: Request, res: Response) {
    const shopify = await this.getShopifyInstance();

    return await shopify.auth.callback({
      rawRequest: req,
      rawResponse: res,
    });
  }

  async checkInstallStatus(user: any) {
    const client = await this.getShopifyClient(user);

    const query = `#graphql
      query getInfo {
        currentAppInstallation {
          accessScopes {
            handle
          }
          app {
            previouslyInstalled
          }
        }
      }
    `;

    const response = await client.request(query);

    return response?.data?.currentAppInstallation;
  }
}
