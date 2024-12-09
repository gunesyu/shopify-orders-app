/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  AnyAction,
  Dispatch as ReduxDispatch,
  ThunkDispatch,
} from "@reduxjs/toolkit";
import type { TypedUseSelectorHook } from "react-redux";
import {
  Provider as ReduxProvider,
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
} from "react-redux";

import store from "@Config/store/store";

type RootState = ReturnType<typeof store.getState>;

type Dispatch = typeof store.dispatch;

const useDispatch = (): ThunkDispatch<any, undefined, AnyAction> &
  ReduxDispatch<AnyAction> => useReduxDispatch<Dispatch>();
const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;

function StoreProvider({ children }: { children: any }): JSX.Element {
  return <ReduxProvider store={store}>{children}</ReduxProvider>;
}

export default StoreProvider;

export { type RootState, type Dispatch, useDispatch, useSelector };
