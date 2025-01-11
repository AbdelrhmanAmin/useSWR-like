
let URLsCalled: string[] = [];
let invokes = 0;

export const setupMockFetch = () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = function () {
    invokes++;
    return originalFetch.apply(this, arguments);
  };
};

export const getMockContext = () => {
  return {
    URLS: URLsCalled,
    invokes,
  };
};

export const resetMockContext = () => {
  URLsCalled = [];
  invokes = 0;
};
