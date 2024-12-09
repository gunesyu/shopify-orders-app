import { IOrder } from "@Types/IOrder";

interface OrdersTableProps {
  orders: IOrder[];
  loading?: boolean;
}

function OrdersTable({ orders = [], loading }: OrdersTableProps): JSX.Element {
  if (loading) return <div>Loading...</div>;

  return <div>{JSON.stringify(orders)}</div>;
}

export default OrdersTable;
