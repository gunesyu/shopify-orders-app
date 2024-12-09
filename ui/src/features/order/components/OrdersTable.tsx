import { Empty, Flex, Table } from "antd";

import { IOrder } from "@Types/IOrder";

import RefreshOrdersButton from "@Features/order/components/RefreshOrdersButton";
import columns from "@Features/order/utils/ordersTableColumns";

interface OrdersTableProps {
  orders?: IOrder[];
  loading?: boolean;
  onRefreshClick: () => void;
}

function OrdersTable({
  orders = [],
  loading,
  onRefreshClick,
}: OrdersTableProps): JSX.Element {
  return (
    <Table
      loading={loading}
      columns={columns}
      dataSource={orders}
      locale={{ emptyText: <Empty description="No Data" /> }}
      title={() => (
        <Flex justify="space-between" align="center">
          <h2>Orders</h2>
          <RefreshOrdersButton onRefreshClick={onRefreshClick} />
        </Flex>
      )}
      pagination={{
        pageSize: 10,
        simple: true,
        showTotal: undefined,
      }}
    />
  );
}

export default OrdersTable;
