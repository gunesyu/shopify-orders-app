import { Controller, Get, Query, Req, Res, UsePipes } from '@nestjs/common';

import { ShopifyService } from './shopify.service';
import { ShopifyInstallDto } from './shopify.dto';
import { HmacPipe } from './validation/hmac.pipe';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';

@Controller('shopify')
export class ShopifyController {
  constructor(
    private shopifyService: ShopifyService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
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
  async redirect(@Res() res: Response, @Req() req: Request) {
    await this.shopifyService.handleInstallRedirect(req, res);

    return res.redirect('/');
  }
}
