import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ShopifyInstallDto {
  @IsString()
  @IsNotEmpty()
  hmac: string;

  @IsString()
  @IsOptional()
  host?: string;

  @IsString()
  @IsNotEmpty()
  shop: string;

  @IsString()
  @IsNotEmpty()
  timestamp: number;
}

export class ShopifyInstallRedirectDto extends ShopifyInstallDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  state: string;
}
