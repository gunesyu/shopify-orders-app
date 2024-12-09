import { ShopifyInstallRedirectDto } from './shopify.dto';
import { ConfigService } from '@nestjs/config';
import { ShopifyService } from './shopify.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ShopifyUtil {
  constructor(
    private readonly shopifyService: ShopifyService,
    private readonly configService: ConfigService,
  ) {}

  // https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/authorization-code-grant#step-1-verify-the-installation-request
  async verifyHmac(query: any): Promise<boolean> {
    const shopify = await this.shopifyService.getShopifyInstance();

    return await shopify.utils.validateHmac(query);
  }

  // https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/authorization-code-grant#step-3-validate-authorization-code
  verifyAuthorizationCode(query: ShopifyInstallRedirectDto): boolean {
    const { code, host, state } = query;

    if (!this.verifyHmac(query)) {
      return false;
    }

    if (
      /^[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com/.test(`${host}.myshopify.com`)
    ) {
      return false;
    }

    if (state !== this.configService.get('SHOPIFY_API_CLIENT_ID')) {
      return false;
    }

    console.log(code);

    return true;
  }
}
