import type { TableProps } from "antd";
import { IOrder } from "@Types/IOrder";

const columns: TableProps<IOrder>["columns"] = [
  {
    title: "Customer",
    key: "email",
    render: (_, record) => <>{record.customer?.email}</>,
  },
  {
    title: "Total Amount",
    key: "amount",
    render: (_, record) => (
      <>
        {record.total} {record.currency}
      </>
    ),
  },
  {
    title: "Order ID",
    dataIndex: "orderId",
    key: "orderId",
  },
  {
    title: "Order Date",
    dataIndex: "createdAt",
    key: "createdAt",
  },
];

export default columns;
