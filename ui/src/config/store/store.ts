import { configureStore } from "@reduxjs/toolkit";
import type { EnhancedStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import orderApi from "@Config/fetcher/orderApi";

const APIS = ["orderApi"];
const QUERY_TYPES_WITH_REJECTED_STATUS = APIS.map(
  (a) => `${a}/executeQuery/rejected`
);
const MUTATION_TYPES_WITH_REJECTED_STATUS = APIS.map(
  (a) => `${a}/executeMutation/rejected`
);

const createStore = (): EnhancedStore =>
  configureStore({
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [
            ...QUERY_TYPES_WITH_REJECTED_STATUS,
            ...MUTATION_TYPES_WITH_REJECTED_STATUS,
          ],
          ignoredPaths: [/queries.*.error/, /mutations.*.error/],
        },
      }).concat([orderApi.middleware]),
    reducer: {
      [orderApi.reducerPath]: orderApi.reducer,
    },
  });

const store = createStore();

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

export default store;
