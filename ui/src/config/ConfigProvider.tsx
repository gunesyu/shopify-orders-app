import {
  StyleProvider,
  legacyLogicalPropertiesTransformer,
} from "@ant-design/cssinjs";
import { ConfigProvider as AntConfigProvider } from "antd";

function ConfigProvider({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}): JSX.Element {
  return (
    <StyleProvider
      hashPriority="low"
      transformers={[legacyLogicalPropertiesTransformer]}
    >
      <AntConfigProvider form={{ requiredMark: true }}>
        {children}
      </AntConfigProvider>
    </StyleProvider>
  );
}

export default ConfigProvider;
