export interface IShopifyOrderCustomer {
  id: string;
  displayName: string;
  email: string;
}

export interface IShopifyOrderTotalPriceShopMoney {
  amount: number;
  currencyCode: string;
}

export interface IShopifyOrders {
  id: string;
  name: string;
  customer: IShopifyOrderCustomer;
  createdAt: Date;
  updatedAt: Date;
  totalPriceSet: {
    shopMoney: IShopifyOrderTotalPriceShopMoney;
  };
}

export interface ICustomer {
  id: number;
  customerId: string;
  name: string;
  email: string;
}

export interface IOrder {
  id: number;
  orderId: string;
  shopId: number;
  customerId: number;
  customer: ICustomer;
  total: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}
