import { Button } from "antd";

import { UndoOutlined } from "@ant-design/icons";

function RefreshOrdersButton({
  onRefreshClick,
}: {
  onRefreshClick: () => void;
}): JSX.Element {
  return (
    <Button icon={<UndoOutlined />} size="large" onClick={onRefreshClick} />
  );
}

export default RefreshOrdersButton;
