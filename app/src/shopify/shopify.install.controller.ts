import { Controller, Get, Query, Req, Res, UsePipes } from '@nestjs/common';

import { ShopifyInstallService } from './shopify.install.service';
import {
  ShopifyInstallDto,
  ShopifyInstallRedirectDto,
} from './shopify.install.dto';
import { HmacPipe } from './validation/hmac.pipe';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('shopify')
export class ShopifyInstallController {
  constructor(
    private shopifyService: ShopifyInstallService,
    private readonly configService: ConfigService,
  ) {}

  @Get('install')
  @UsePipes(HmacPipe)
  async install(
    @Res() res: Response,
    @Req() req: Request,
    @Query() query?: ShopifyInstallDto,
  ) {
    const { shop } = query;

    return await this.shopifyService.handleInstall(shop, req, res);
  }

  @Get('redirect')
  async redirect(
    @Res() res: Response,
    @Req() req: Request,
    @Query() query?: ShopifyInstallRedirectDto,
  ) {
    const { shop } = query;

    await this.shopifyService.handleInstallRedirect(shop, req, res);

    const redirectUrl = `${this.configService.get('UI_BASE_URL')}/?s=${btoa(shop)}`;

    return res.redirect(redirectUrl);
  }
}
