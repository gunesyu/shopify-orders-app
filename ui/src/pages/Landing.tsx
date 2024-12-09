import { useGetOrdersLazy } from "@Config/fetcher/orderApi";
import { useEffect, useState } from "react";

import OrdersTable from "@Features/order/components/OrdersTable";

function Landing(): JSX.Element {
  const [shop, setShop] = useState<string>();

  const [fetchOrders, { currentData, isFetching, isError, error }] =
    useGetOrdersLazy();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encodedShopName = params.get("s") || "";
    const shop = atob(encodedShopName);

    setShop(shop);

    fetchOrders({ shop });
  }, []);

  const handleRefreshClick = () => {
    if (!shop) return;

    fetchOrders({ shop, refresh: true });
  };

  return (
    <div>
      <OrdersTable
        orders={currentData}
        loading={isFetching}
        onRefreshClick={handleRefreshClick}
      />
      {isError && <div>{JSON.stringify(error)}</div>}
    </div>
  );
}

export default Landing;
