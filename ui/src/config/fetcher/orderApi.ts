import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IGetOrdersRequest } from "@Types/IApi";
import { IOrder } from "@Types/IOrder";

const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
  }),
  endpoints: (builder) => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getOrders: builder.query<IOrder[], IGetOrdersRequest>({
      query: (arg) => ({
        url: `shopify/order`,
        method: "GET",
        params: arg,
      }),
    }),
  }),
});

const {
  useGetOrdersQuery: useGetOrders,
  useLazyGetOrdersQuery: useGetOrdersLazy,
} = orderApi;

export default orderApi;

export { useGetOrders, useGetOrdersLazy };
