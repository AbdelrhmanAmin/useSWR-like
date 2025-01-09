import React, { createContext, useMemo } from "react";
import createObserver, { Observer } from "../utils/createObserver";

export type Nullable<T> = T | null;

const FetchContext = createContext<Nullable<{ [key: string]: any }>>(null);

const FetchProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value?: {
    [key: string]: any;
  };
}) => {
  const ctx = useMemo(() => {
    return {
      ...value,
      cache: createObserver(),
      fetching: createObserver(),
      errors: createObserver(),
    };
  }, [value]);
  return <FetchContext.Provider value={ctx}>{children}</FetchContext.Provider>;
};

const useFetchContext = () => {
  const ctx = React.useContext(FetchContext);
  return ctx;
};

export { FetchProvider, useFetchContext };
