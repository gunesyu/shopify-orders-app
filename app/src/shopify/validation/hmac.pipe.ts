import {
  PipeTransform,
  Injectable,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ShopifyUtil } from '../shopify.util';

@Injectable()
export class HmacPipe implements PipeTransform {
  readonly logger = new Logger(HmacPipe.name);

  constructor(private readonly shopifyUtil: ShopifyUtil) {}

  transform(value: any) {
    this.logger.log('HMAC pipe called.');

    if (!this.shopifyUtil.verifyHmac(value)) {
      throw new BadRequestException('Invalid HMAC signature');
    }

    this.logger.log('HMAC signature verified.');

    return value;
  }
}
