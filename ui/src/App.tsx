import ConfigProvider from "@Config/ConfigProvider";
import StoreProvider from "@Config/store";
import Landing from "@Pages/Landing";

function App(): JSX.Element {
  return (
    <ConfigProvider>
      <StoreProvider>
        <Landing />
      </StoreProvider>
    </ConfigProvider>
  );
}

export default App;
