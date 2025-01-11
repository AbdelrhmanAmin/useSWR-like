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
  it("returns an object with data", () => {
    const { result } = renderHook(() =>
      useFetch("https://jsonplaceholder.typicode.com/todos/1")
    );
    expect(result.current).toHaveProperty("data");
  });
});
