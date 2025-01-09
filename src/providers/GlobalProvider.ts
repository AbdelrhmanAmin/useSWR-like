import createObserver, { Observer } from "../utils/createObserver";

// In case a FetchProvider has not been added as a wrapper. Pick up the config from this.
const defaultProviderValue = {
  cache: createObserver(),
  fetching: createObserver(),
  errors: createObserver(),
  staleWatcher: createObserver(),
  fallback: {},
  keysToRevalidateOnFocus: new Map(),
};

export interface Provider {
  cache: Observer;
  fetching: Observer;
  errors: Observer;
  staleWatcher: Observer;
  fallback: any;
  keysToRevalidateOnFocus: Map<string, boolean>;
}

export default defaultProviderValue;
