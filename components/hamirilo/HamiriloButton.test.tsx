import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HamiriloButton } from "./HamiriloButton";

describe("HamiriloButton", () => {
  it("renders its label", () => {
    render(<HamiriloButton>保存</HamiriloButton>);
    expect(screen.getByRole("button", { name: "保存" })).toBeTruthy();
  });
});
