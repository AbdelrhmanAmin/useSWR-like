import React, { createContext, useContext, useMemo } from "react";
import createObserver from "../utils/createObserver";
import { API, Provider } from "./GlobalProvider";

export type Nullable<T> = T | null;

type ContextProvider = Omit<Provider, "fallback" | "keysToRevalidateOnFocus"> &
  API;

const FetchContext = createContext<Nullable<ContextProvider>>(null);

const FetchProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value?: API;
}) => {
  const ctx = useMemo(() => {
    return {
      ...value,
      cache: createObserver(),
      fetching: createObserver(),
      errors: createObserver(),
      staleWatcher: createObserver(),
      revalidators: new Map(),
    };
  }, [value]);
  return <FetchContext.Provider value={ctx}>{children}</FetchContext.Provider>;
};

const useFetchContext = () => {
  const ctx = useContext(FetchContext);
  return ctx;
};

export { FetchProvider, useFetchContext };
