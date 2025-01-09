import createObserver from "../utils/createObserver";

// In case a FetchProvider has not been added as a wrapper. Pick up the config from this.
const defaultProviderValue = {
  cache: createObserver(),
  fetching: createObserver(),
  errors: createObserver(),
};

export default defaultProviderValue;
