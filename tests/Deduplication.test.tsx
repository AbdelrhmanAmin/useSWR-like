import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { useFetch } from "use-swr-like";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  getMockContext,
  resetMockContext,
  setupMockFetch,
} from "./mocks/apiCalls";

const Component = ({ id }) => {
  const { data, error, isLoading } = useFetch<{ title: string }>(
    "https://jsonplaceholder.typicode.com/todos/" + id
  );
  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data && <p data-testid="title">{data.title}</p>}
    </div>
  );
};


const renderExample = async (ids: [number, number]) => {
  const [id1, id2] = ids;
  render(
    <>
      <Component id={id1} />
      <Component id={id2} />
    </>
  );
  await waitFor(() => screen.getAllByTestId("title"));
};

describe("deduplication", () => {
  beforeEach(() => {
    setupMockFetch();
  });
  afterEach(() => {
    resetMockContext();
  });
  it("should only fetch once for the same key", async () => {
    await renderExample([1, 1]);
    const { invokes } = getMockContext();
    expect(invokes).toBe(1);
  });
  it("should fetch for different keys", async () => {
    await renderExample([1, 2]);
    const { invokes } = getMockContext();
    expect(invokes).toBe(2);
  });
});
