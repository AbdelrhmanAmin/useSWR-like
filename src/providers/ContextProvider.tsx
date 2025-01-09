import React, { createContext, useMemo } from "react";
import createObserver, { Observer } from "../utils/createObserver";

const defaultContext = {
  cache: createObserver(),
  fetching: createObserver(),
  errors: createObserver(),
};

const FetchContext = createContext<{
  cache: Observer;
  fetching: Observer;
  errors: Observer;
}>(defaultContext);

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
      ...defaultContext,
    };
  }, [value]);
  return <FetchContext.Provider value={ctx}>{children}</FetchContext.Provider>;
};

const useFetchContext = () => {
  const ctx = React.useContext(FetchContext);
  return ctx;
};

export { FetchProvider, useFetchContext };
