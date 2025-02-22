import { FetchHook } from "../useFetch";
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
  revalidateOnFocus: false,
  dedupingInterval: 2000,
  onSuccess: undefined,
  onError: undefined,
  onSettle: undefined,
};

export type Provider = {
  cache: Observer;
  fetching: Observer;
  errors: Observer;
  staleWatcher: Observer;
  fallback: any;
  keysToRevalidateOnFocus: Map<string, boolean>;
  revalidators: Map<string, FetchHook["revalidate"] | undefined>;
};

export type API = {
  revalidateOnFocus?: boolean;
  fallbackData?: any;
  dedupingInterval?: number;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  onSettle?: () => void;
};

export default defaultProviderValue;
