import {
  act,
  render,
  screen,
  waitFor
} from "@testing-library/react";
import React from "react";
import { FetchProvider, useFetch, useFetchConfig } from "use-swr-like";
import { describe, expect, it } from "vitest";

const Component = ({ id }) => {
  const { data, error, isLoading } = useFetch<{ title: string }>(
    "https://jsonplaceholder.typicode.com/todos/" + id
  );
  const { revalidate } = useFetchConfig();
  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data?.title && <p data-testid="title">{data.title}</p>}
      <button
        data-testid="refetch"
        onClick={() =>
          revalidate("https://jsonplaceholder.typicode.com/todos/1", () => ({
            title: "Hello World",
          }))
        }
      >
        Refetch
      </button>
    </div>
  );
};

const renderExample = (ids: [number]) => {
  const [id1] = ids;

  act(() =>
    render(
      <FetchProvider>
        <Component id={id1} />
      </FetchProvider>
    )
  );
};

describe("useFetchConfig", () => {
  it("revalidate using useFetchConfig", async () => {
    renderExample([1]);
    await waitFor(() => screen.getByTestId("title"));
    const title = screen.getByTestId("title").textContent;
    const refetch = screen.getByTestId("refetch");
    act(() => refetch.click());

    const newTitle = screen.getByTestId("title").textContent;
    expect(title).not.toBe(newTitle);
  });
});
