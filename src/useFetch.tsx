import { useSyncExternalStore } from "use-sync-external-store";
import { useFetchContext } from "./providers/ContextProvider";
import defaultProviderValue from "./providers/GlobalProvider";
import baseFetcher from "./utils/baseFetcher";
import { useEffect } from "react";

const useFetch = (key: string) => {
  const context = useFetchContext() || defaultProviderValue;
  const isValidKey = key && typeof key === "string";

  const { cache, fetching, errors } = context;

  const data = useSyncExternalStore(
    cache.subscribe,
    isValidKey ? cache.entries.get(key) : undefined
  );
  const error = useSyncExternalStore(
    errors.subscribe,
    isValidKey ? errors.entries.get(key) : undefined
  );
  const isLoading = useSyncExternalStore(
    fetching.subscribe,
    isValidKey ? fetching.entries.get(key) : undefined
  );
  const setFetching = (state: boolean) => fetching.setEntry(key, state);
  const fetchData = () => {
    if (isValidKey) {
      setFetching(true);
      baseFetcher(key)
        .then((data) => {
          cache.setEntry(key, data);
          errors.setEntry(key, null);
        })
        .catch((err) => {
          errors.setEntry(key, err);
          cache.setEntry(key, null);
        })
        .finally(() => {
          setFetching(false);
        });
    }
  };
  useEffect(() => {
    if (isValidKey) {
      fetchData();
    }
  }, []);

  return {
    data,
    error: isValidKey ? error : null,
    isLoading: isValidKey ? isLoading : false,
    fetchData,
  };
};
