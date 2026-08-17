import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ApplicationButton } from "./ApplicationButton";

describe("ApplicationButton", () => {
  it("renders its label", () => {
    render(<ApplicationButton>保存</ApplicationButton>);
    expect(screen.getByRole("button", { name: "保存" })).toBeTruthy();
  });
});
