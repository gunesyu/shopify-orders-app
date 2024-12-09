import { Injectable } from '@nestjs/common';
import '@shopify/shopify-api/adapters/node';
import { Request, Response } from 'express';
import { CreateShopifyShopDto } from './shopify.install.dto';
import { Shop } from '@prisma/client';
import { ShopifyService } from './shopify.service';
import { ShopifyRepository } from './shopify.repository';

@Injectable()
export class ShopifyInstallService {
  constructor(
    private readonly shopifyService: ShopifyService,
    private readonly shopifyRepository: ShopifyRepository,
  ) {}

  async handleInstall(shop: string, req: Request, res: Response) {
    const shopify = this.shopifyService.getShopifyInstance();

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
    const shopify = this.shopifyService.getShopifyInstance();

    const callback = await shopify.auth.callback({
      rawRequest: req,
      rawResponse: res,
    });

    const shopExists = await this.shopifyRepository.getOneShopByUrl(shop);

    if (shopExists) {
      return;
    }

    return await this.saveStore(callback, shop);
  }

  async saveStore(callback, shop: string) {
    const { session } = callback;

    const shopInfo = await this.shopifyService.getShopInfo({
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

  async checkInstallStatus(shop: Partial<Shop>) {
    const storedShop = await this.shopifyRepository.getOneShopByUrl(shop.url);

    const { client } = await this.shopifyService.getShopifyClient(storedShop);

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
