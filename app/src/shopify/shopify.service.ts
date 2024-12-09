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
import { CreateShopifyShopDto } from './shopify.dto';
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
    const existingShop = await this.shopifyRepository.getOneByUrl(shop.url);
    if (existingShop) {
      shop = existingShop;
    }

    const shopify = this.getShopifyInstance();
    const session = this.getShopifySession(shop.url);

    session.accessToken = shop.token;

    const client = new shopify.clients.Graphql({ session });

    return { client, session };
  }

  async handleInstall(shop: string, req: Request, res: Response) {
    const shopify = this.getShopifyInstance();

    res.setHeader('Set-Cookie', [
      `code=${req.query.session}; Path=/; Max-Age=86400`,
    ]);

    await shopify.auth.begin({
      shop: shopify.utils.sanitizeShop(shop, true),
      callbackPath: '/shopify/redirect',
      isOnline: false,
      rawRequest: req,
      rawResponse: res,
    });

    return;
  }

  async handleInstallRedirect(shop: string, req: Request, res: Response) {
    const shopify = this.getShopifyInstance();

    const callback = await shopify.auth.callback({
      rawRequest: req,
      rawResponse: res,
    });

    const shopExists = await this.shopifyRepository.getOneByUrl(shop);

    if (shopExists) {
      return;
    }

    return await this.saveStore(callback, shop);
  }

  async saveStore(callback, shop: string) {
    const { session } = callback;

    const shopInfo = await this.getShopInfo({
      url: shop,
      token: session.accessToken,
    });

    const user: CreateShopifyShopDto = {
      email: shopInfo.email,
      url: shopInfo.myshopifyDomain,
      name: shopInfo.name,
      token: session.accessToken,
    };

    return await this.shopifyRepository.create(user);
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

  async checkInstallStatus(shop: Partial<Shop>) {
    const storedShop = await this.shopifyRepository.getOneByUrl(shop.url);

    const { client } = await this.getShopifyClient(storedShop);

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

    return response?.data;
  }
}
