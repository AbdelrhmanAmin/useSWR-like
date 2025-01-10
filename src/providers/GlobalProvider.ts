import { FetchHook, Options } from "../useFetch";
import createObserver, { Observer } from "../utils/createObserver";

// In case a FetchProvider has not been added as a wrapper. Pick up the config from this.
const defaultProviderValue = {
  cache: createObserver(),
  fetching: createObserver(),
  errors: createObserver(),
  staleWatcher: createObserver(),
  fallback: {},
  keysToRevalidateOnFocus: new Map(),
  revalidators: new Map(),
  revalidateOnMount: true,
  revalidateOnFocus: false,
  dedupingInterval: 2000,
  onSuccess: undefined,
  onError: undefined,
};

export interface Provider {
  cache: Observer;
  fetching: Observer;
  errors: Observer;
  staleWatcher: Observer;
  fallback: any;
  keysToRevalidateOnFocus: Map<string, boolean>;
  revalidators: Map<string, FetchHook["revalidate"] | undefined>;
  revalidateOnMount: boolean;
  revalidateOnFocus: boolean;
  dedupingInterval: number;
  onSuccess: Options["onSuccess"];
  onError: Options["onError"];
}

export default defaultProviderValue;
