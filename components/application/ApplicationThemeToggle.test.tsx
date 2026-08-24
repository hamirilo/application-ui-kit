import { fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ApplicationThemeToggle } from "./ApplicationThemeToggle";

/** 非制御時は Sun/Moon を両方描画し、html の .dark クラスで CSS 出し分けする */
function icons(container: HTMLElement) {
  const sun = container.querySelector(".hidden.dark\\:inline-block");
  const moon = container.querySelector(".inline-block.dark\\:hidden");
  return { sun, moon };
}

describe("ApplicationThemeToggle", () => {
  afterEach(() => {
    document.documentElement.classList.remove("dark");
    localStorage.removeItem("theme");
  });

  it("非制御では初回レンダーから両アイコンを描画する（マウント待ちの空白を作らない）", () => {
    const { container } = render(<ApplicationThemeToggle />);
    const { sun, moon } = icons(container);
    expect(sun).toBeTruthy();
    expect(moon).toBeTruthy();
  });

  it("ダークページで effect 前にクリックしてもライトへ切り替わる", () => {
    document.documentElement.classList.add("dark");
    const { getByRole } = render(<ApplicationThemeToggle />);
    // 現在値は state ではなく DOM から読むため、同期前のクリックでも正しく反転する
    fireEvent.click(getByRole("button"));
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("クリックで .dark クラスと localStorage を切り替える", () => {
    const { getByRole } = render(<ApplicationThemeToggle />);
    fireEvent.click(getByRole("button"));
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("dark");
    fireEvent.click(getByRole("button"));
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("制御モードでは theme プロパティのアイコンだけを描画し、DOM を書き換えない", () => {
    let next: boolean | undefined;
    const { container, getByRole } = render(
      <ApplicationThemeToggle
        theme="dark"
        onToggle={(isDark) => {
          next = isDark;
        }}
      />,
    );
    const { sun, moon } = icons(container);
    expect(sun).toBeNull();
    expect(moon).toBeNull();
    fireEvent.click(getByRole("button"));
    expect(next).toBe(false);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("theme")).toBeNull();
  });
});
