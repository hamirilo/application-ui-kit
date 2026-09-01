import { fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CopyFieldIsland } from "./CopyFieldIsland";

function stubSecureContext(secure: boolean) {
  Object.defineProperty(window, "isSecureContext", { value: secure, configurable: true });
}

function stubClipboard(writeText: ((text: string) => Promise<void>) | undefined) {
  Object.defineProperty(navigator, "clipboard", {
    value: writeText ? { writeText } : undefined,
    configurable: true,
  });
}

function stubExecCommand(impl: () => boolean) {
  Object.defineProperty(document, "execCommand", { value: impl, configurable: true });
}

afterEach(() => {
  stubSecureContext(false);
  stubClipboard(undefined);
  stubExecCommand(() => false);
});

describe("CopyFieldIsland", () => {
  it("readonly の入力欄に値を出し、コピーボタンを添える", () => {
    const { getByRole } = render(<CopyFieldIsland value="https://example.com/one-time" />);
    const input = getByRole("textbox", { name: "コピーする値" }) as HTMLInputElement;
    expect(input.value).toBe("https://example.com/one-time");
    expect(input.readOnly).toBe(true);
    expect(getByRole("button", { name: /コピー/ })).toBeTruthy();
  });

  it("コピー成功時は案内行を出さない（成功はボタン側が伝える）", async () => {
    stubSecureContext(true);
    stubClipboard(() => Promise.resolve());

    const { getByRole } = render(<CopyFieldIsland value="v" />);
    fireEvent.click(getByRole("button", { name: /コピー/ }));
    await waitFor(() => expect(getByRole("button").textContent).toContain("コピーしました"));
    expect(getByRole("status").textContent).toBe("");
  });

  it("全滅時は値を選択したまま Ctrl+C を案内する", async () => {
    const { getByRole } = render(<CopyFieldIsland value="one-time" />);
    const input = getByRole("textbox", { name: "コピーする値" }) as HTMLInputElement;

    fireEvent.click(getByRole("button", { name: /コピー/ }));
    await waitFor(() => expect(getByRole("status").textContent).toContain("Ctrl+C（Mac は ⌘+C）"));
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe(input.value.length);
  });
});
