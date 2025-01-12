import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { useFetch } from "use-swr-like";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  getMockContext,
  resetMockContext,
  setupMockFetch,
} from "./mocks/apiCalls";
import { LocalOptionsAPI } from "use-swr-like/useFetch";

const Component = ({
  id,
  options,
}: {
  id: number;
  options?: LocalOptionsAPI;
}) => {
  const { data, error, isLoading } = useFetch<{ title: string }>(
    "https://jsonplaceholder.typicode.com/todos/" + id,
    options
  );

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data.title ? (
        <p data-testid="title">{data.title}</p>
      ) : (
        <p data-testid="empty">No data</p>
      )}
    </div>
  );
};

const renderExample = (
  ids: [number, number],
  options: [LocalOptionsAPI, LocalOptionsAPI]
) => {
  const [id1, id2] = ids;
  const [options1, options2] = options;
  render(
    <>
      <Component key={id1} id={id1} options={options1} />
      <Component key={id2} id={id2} options={options2} />
    </>
  );
};

describe("deduplication and control", () => {
  beforeEach(() => {
    setupMockFetch();
  });
  afterEach(() => {
    resetMockContext();
  });
  it("shouldn't fetch on start", () => {
    renderExample([1, 2], [{ enabled: false }, { enabled: false }]);
    const { invokes } = getMockContext();
    expect(invokes).toBe(0);
  });

  it("should be empty", async () => {
    renderExample([1, 2], [{ enabled: false }, { enabled: false }]);
    await waitFor(() => screen.getAllByTestId("empty"));
    expect(screen.getAllByTestId("empty").length).toBe(2);
  });

  it("should only start the first one", () => {
    renderExample([1, 2], [{}, { enabled: false }]);
    const { invokes, URLS } = getMockContext();
    console.log({ URLS });
    expect(invokes).toBe(1);
  });
});
