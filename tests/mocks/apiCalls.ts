let URLsCalled: string[] = [];
let invokes = 0;

const orgFetchMethod = globalThis.fetch;

export const setupMockFetch = () => {
  globalThis.fetch = function () {
    invokes++;
    URLsCalled.push(arguments[0]);
    return orgFetchMethod.apply(this, arguments);
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
