import {
  IsBooleanString,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateShopifyOrderDto {
  @IsNumber()
  @IsNotEmpty()
  shopId: number;

  @IsNumber()
  @IsNotEmpty()
  customerId: number;

  @IsString()
  @IsNotEmpty()
  orderId: number;

  @IsNumber()
  @IsNotEmpty()
  total: number;
}

export class GetOrdersDto {
  @IsString()
  @IsNotEmpty()
  shop: string;

  @IsBooleanString()
  @IsOptional()
  refresh?: boolean;

  @IsDate()
  @IsOptional()
  since?: string;
}
