/**
 * @format
 */

import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import { Provider } from "react-redux";
import { store } from "./Src/Redux/store";
import { NetworkStatusProvider } from "./Src/Components/ReuseComponents/Internet/NetworkStatusProvider";

const RootComponent = () => (
  <Provider store={store}>
    <NetworkStatusProvider>
      <App />
    </NetworkStatusProvider>
  </Provider>
);

AppRegistry.registerComponent(appName, () => RootComponent);
