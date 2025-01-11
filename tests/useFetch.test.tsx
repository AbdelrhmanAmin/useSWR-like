import { useFetch } from "use-swr-like";
import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";

describe("useFetch", () => {
  it("should be a hook", () => {
    expect(useFetch).toBeInstanceOf(Function);
  });
  it("arguments: (required valid key, optional options)", () => {
    expect(() => renderHook(() => useFetch(""))).toThrowError(
      "[useFetch] key must be a non-empty string."
    );
  });
  it("returns an object with data, error, isLoading, fetchData, revalidate", () => {
    const { result } = renderHook(() =>
      useFetch("https://jsonplaceholder.typicode.com/todos/1")
    );
    expect(result.current).toHaveProperty("data");
    expect(result.current).toHaveProperty("error");
    expect(result.current).toHaveProperty("isLoading");
    expect(result.current).toHaveProperty("fetchData");
    expect(result.current).toHaveProperty("revalidate");
  });
  it("shouldn't fetch if enabled is false", () => {
    const { result } = renderHook(() =>
      useFetch("https://jsonplaceholder.typicode.com/todos/1", {
        enabled: false,
      })
    );
    const isEmpty = Object.keys(result.current.data as object).length === 0;
    expect(isEmpty).toBe(true);
  });
});
