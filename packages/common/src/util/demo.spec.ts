import { describe, it, expect } from "vitest";
import { tryOr } from "./tryOr";
import { orThrow } from "./orThrow";

describe("tryOr", () => {
  it("returns the result of the function if it does not throw", () => {
    const result = tryOr(() => "success", "fallback");
    expect(result).toBe("success");
  });

  it("returns the default value if the function throws", () => {
    const result = tryOr(() => {
      throw new Error("fail");
    }, "fallback");
    expect(result).toBe("fallback");
  });
});

describe("orThrow", () => {
  it("throws an error with the specified message", () => {
    expect(() => orThrow("test error")).toThrowError("test error");
  });
});
