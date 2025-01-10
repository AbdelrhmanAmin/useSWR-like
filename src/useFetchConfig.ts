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
  const context = (globalContext || defaultProviderValue) as Provider;
  const revalidate: Revalidate = (key: string, updater, updateOnSettle) => {
    return context.revalidators.get(key)?.(updater, updateOnSettle);
  };
  return {
    revalidate,
    fallback: context?.fallback,
    cache: context?.cache,
    dedupingInterval: context?.dedupingInterval,
    revalidateOnFocus: context?.revalidateOnFocus,
    revalidateOnMount: context?.revalidateOnMount,
  };
};

export default useFetchConfig;
