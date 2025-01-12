import React, { createContext, useContext, useMemo } from "react";
import createObserver from "../utils/createObserver";
import { API, Provider } from "./GlobalProvider";

export type Nullable<T> = T | null;

type ContextProvider = Omit<Provider, "fallback" | "keysToRevalidateOnFocus"> &
  API;

const FetchContext = createContext<Nullable<ContextProvider>>(null);

const FetchProvider = ({
  children,
  config,
}: {
  children: React.ReactNode;
  config?: API;
}) => {
  const ctx = useMemo(() => {
    return {
      revalidateOnFocus: false,
      ...config,
      cache: createObserver(),
      fetching: createObserver(),
      errors: createObserver(),
      staleWatcher: createObserver(),
      revalidators: new Map(),
    };
  }, [config]);
  return <FetchContext.Provider value={ctx}>{children}</FetchContext.Provider>;
};

const useFetchContext = () => {
  const ctx = useContext(FetchContext);
  return ctx;
};

export { FetchProvider, useFetchContext };
