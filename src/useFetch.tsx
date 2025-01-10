import { useSyncExternalStore } from "use-sync-external-store";
import { Nullable, useFetchContext } from "./providers/ContextProvider";
import defaultProviderValue, {
  API,
  Provider,
} from "./providers/GlobalProvider";
import baseFetcher from "./utils/baseFetcher";
import { useEffect, useCallback } from "react";
import { Observer } from "./utils/createObserver";

export interface FetchHook<T = any> {
  data: T;
  error: any;
  isLoading: boolean;
  fetchData: () => void;
  revalidate: (updater: Function | unknown, updateOnSettle?: boolean) => void;
}

const getKeyFrom = (
  key: string,
  resources: Nullable<{ [key: string]: any }>[] | { [key: string]: any }
) => {
  if (Array.isArray(resources)) {
    const slot = resources.find((obj) => obj?.[key])?.[key];
    return slot;
  }
  return resources[key];
};

const useFetch = <T,>(key: string, options?: API): FetchHook<T> => {
  const globalContext = useFetchContext();
  const context = (globalContext || defaultProviderValue) as Provider;
  const contextQueue = [globalContext, defaultProviderValue];
  const optionsQueue = [options, globalContext];
  const isValidKey = key && typeof key === "string";

  const [cache, fetching, errors, staleWatcher, keysToRevalidateOnFocus]: [
    Observer,
    Observer,
    Observer,
    Observer,
    Provider["keysToRevalidateOnFocus"]
  ] = [
    getKeyFrom("cache", contextQueue),
    getKeyFrom("fetching", contextQueue),
    getKeyFrom("errors", contextQueue),
    getKeyFrom("staleWatcher", contextQueue),
    getKeyFrom("keysToRevalidateOnFocus", contextQueue),
  ];

  const [
    revalidateOnMount,
    revalidateOnFocus,
    fallbackData,
    dedupingInterval,
    onSettle,
    onSuccess,
    onError,
  ] = [
    getKeyFrom("revalidateOnMount", optionsQueue),
    getKeyFrom("revalidateOnFocus", optionsQueue),
    options?.fallbackData || getKeyFrom("fallback", contextQueue),
    getKeyFrom("dedupingInterval", optionsQueue) ?? 0,
    getKeyFrom("onSettle", optionsQueue),
    getKeyFrom("onSuccess", optionsQueue),
    getKeyFrom("onError", optionsQueue),
  ];

  const data: T = useSyncExternalStore(
    cache.subscribe,
    isValidKey ? () => cache.entries.get(key) : () => null
  );
  const error = useSyncExternalStore(errors.subscribe, () =>
    isValidKey ? errors.entries.get(key) : null
  );
  const isLoading: boolean = useSyncExternalStore(fetching.subscribe, () =>
    isValidKey ? fetching.entries.get(key) : false
  );
  const setFetching = (state: boolean) => fetching.setEntry(key, state);
  const fetchData = () => {
    const isCurrentlyFetching = fetching.entries.get(key);
    const lastFetchTime = staleWatcher.entries.get(key);
    const canFetch = (() => {
      if (!isValidKey) {
        return false;
      }
      const isNew = !lastFetchTime || !dedupingInterval;
      if (isNew && !isCurrentlyFetching) {
        return true;
      }
      const now = Date.now();
      const timeSinceLastFetch = now - lastFetchTime;
      const isActive = timeSinceLastFetch > dedupingInterval;
      return isActive && !isCurrentlyFetching;
    })();

    if (canFetch) {
      setFetching(true);
      baseFetcher(key)
        .then((data) => {
          cache.setEntry(key, data);
          errors.setEntry(key, null);
          staleWatcher.setEntry(key, Date.now());
          onSuccess?.(data);
        })
        .catch((err) => {
          errors.setEntry(key, err);
          cache.setEntry(key, null);
          onError?.(err);
        })
        .finally(() => {
          onSettle?.();
          setFetching(false);
        });
    }
  };

  const revalidate: FetchHook["revalidate"] = useCallback(
    async (updater, UpdateOnSettle) => {
      if (isValidKey) {
        if (typeof updater === "function") {
          const newData = updater(data);
          cache.setEntry(key, newData);
          if (UpdateOnSettle) {
            fetchData();
          }
        } else if (updater) {
          cache.setEntry(key, updater);
          if (UpdateOnSettle) {
            fetchData();
          }
        } else {
          fetchData();
        }
      }
    },
    [fetchData, key]
  );

  useEffect(() => {
    if (isValidKey) {
      context.revalidators.set(key, revalidate);
      return () => {
        context.revalidators.set(key, undefined);
      };
    }
  }, [revalidate]);

  useEffect(() => {
    if (isValidKey) {
      fetchData();
    }
  }, []);

  useEffect(() => {
    if (revalidateOnMount) {
      fetchData();
    }
  }, [revalidateOnMount]);

  useEffect(() => {
    if (revalidateOnFocus && isValidKey) {
      const register = () => {
        if (!keysToRevalidateOnFocus.has(key)) {
          keysToRevalidateOnFocus.set(key, true);
          window.addEventListener("focus", () => fetchData());
          return () => {
            window.removeEventListener("focus", () => fetchData());
            keysToRevalidateOnFocus.set(key, false);
          };
        }
      };
      return register();
    }
  }, [revalidateOnFocus]);

  return {
    data: typeof data === "undefined" ? fallbackData : data,
    error: isValidKey ? error : null,
    isLoading: isValidKey ? isLoading : false,
    fetchData,
    revalidate,
  };
};

export default useFetch;
