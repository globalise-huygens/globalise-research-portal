import { describe, it, expect } from "vitest";
import { orThrow } from "./orThrow";

describe("orThrow", () => {
  it("throws an error with the specified message", () => {
    expect(() => orThrow("test error")).toThrowError("test error");
  });
});
