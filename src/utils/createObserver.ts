type Observer = {
  subscribe: (listener: (data: any) => void) => void;
  setEntry: (k: string, v: any) => void;
  entries: Map<string, any>;
};

const createObserver = (): Observer => {
  const listeners = new Set<(data: any) => void>();
  const entries = new Map<string, any>();

  return {
    subscribe: (listener) => {
      listeners.add(listener);
    },
    setEntry: (k, v) => {
      entries.set(k, v);
      listeners.forEach((listener) => listener(entries));
    },
    get entries() {
      return entries;
    },
  };
};

export default createObserver;
