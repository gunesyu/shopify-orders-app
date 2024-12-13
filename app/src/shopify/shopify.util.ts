import { ShopifyInstallRedirectDto } from './shopify.install.dto';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ShopifyService } from './shopify.service';

@Injectable()
export class ShopifyUtil {
  constructor(
    private readonly shopifyService: ShopifyService,
    private readonly configService: ConfigService,
  ) {}

  // https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/authorization-code-grant#step-1-verify-the-installation-request
  async verifyHmac(query: any): Promise<boolean> {
    const shopify = this.shopifyService.getShopifyInstance();

    try {
      return await shopify.utils.validateHmac(query);
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Invalid HMAC signature');
    }
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
