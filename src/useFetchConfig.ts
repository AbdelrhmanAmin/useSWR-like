import { useFetchContext } from "./providers/ContextProvider";
import defaultProviderValue, { Provider } from "./providers/GlobalProvider";
import { FetchHook } from "./useFetch";

type Revalidate = (
  key: string,
  updater: Function | unknown,
  updateOnSettle?: boolean
) => void;

const useFetchConfig = () => {
  const globalContext = useFetchContext();
  const context = globalContext || defaultProviderValue;
  const revalidate: Revalidate = (key: string, updater, updateOnSettle) => {
    return context.revalidators.get(key)?.(updater, updateOnSettle);
  };
  return {
    revalidate,
    cache: context?.cache,
    dedupingInterval: context?.dedupingInterval,
    revalidateOnFocus: context?.revalidateOnFocus,
    onError: context?.onError,
    onSuccess: context?.onSuccess,
    onSettle: context?.onSettle,
  };
};

export default useFetchConfig;
