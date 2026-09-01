import { describe, expect, it } from "vitest";
import { parseProps } from "./parse-props";

describe("parseProps", () => {
  it("既定ではJSON scalarを解釈する", () => {
    const element = document.createElement("div");
    element.dataset.count = "12";
    expect(parseProps(element)).toEqual({ count: 12 });
  });

  it("指定した属性は文字列のまま保持する", () => {
    const element = document.createElement("div");
    element.dataset.value = "9007199254740993";
    expect(parseProps(element, ["value"])).toEqual({ value: "9007199254740993" });
  });
});
