import { useGetOrdersLazy } from "@Config/fetcher/orderApi";
import { useEffect, useState } from "react";

import OrdersTable from "@Features/order/components/OrdersTable";
import RefreshOrdersButton from "@Features/order/components/RefreshOrdersButton";

function Landing(): JSX.Element {
  const [shop, setShop] = useState<string>();

  const [fetchOrders, { data, isLoading, isError, error }] = useGetOrdersLazy();

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

  console.log(data, isLoading, isError, error);

  return (
    <div>
      <h1>LANDING</h1>
      <OrdersTable orders={data} loading={isLoading} />
      <RefreshOrdersButton onRefreshClick={handleRefreshClick} />
    </div>
  );
}

export default Landing;
