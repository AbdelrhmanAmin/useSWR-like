import { useSyncExternalStore } from "react";
import { Nullable, useFetchContext } from "./providers/ContextProvider";
import defaultProviderValue, {
  API,
  Provider,
} from "./providers/GlobalProvider";
import baseFetcher from "./utils/baseFetcher";
import { useEffect, useCallback, useMemo } from "react";
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

export type LocalOptionsAPI = API & { enabled?: boolean };

const useFetch = <T,>(key: string, options?: LocalOptionsAPI): FetchHook<T> => {
  const isValidKey = !!key && typeof key === "string" && key.length > 0;
  const config = useMemo(() => Object.assign({ enabled: true }, options), []);
  const globalContext = useFetchContext();
  const context = (globalContext || defaultProviderValue) as Provider;
  const ctxSource__debugging = globalContext ? "context" : "default";
  const contextQueue = [globalContext, defaultProviderValue];
  const optionsQueue = [config, globalContext];
  const enabled = getKeyFrom("enabled", config);
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
    revalidateOnFocus,
    fallbackData,
    dedupingInterval,
    onSettle,
    onSuccess,
    onError,
  ] = [
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
      if (!enabled) {
        return false;
      }
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
    if (!canFetch) return;
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
    if (enabled) {
      fetchData();
    }
  }, [enabled]);

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

  if (!isValidKey) {
    throw new Error("[useFetch] key must be a non-empty string.");
  }
  return {
    data: typeof data === "undefined" ? fallbackData : data,
    error: isValidKey ? error : null,
    isLoading: isValidKey ? isLoading : false,
    fetchData,
    revalidate,
  };
};

export default useFetch;
