import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import {
  ApplicationTreeSelect,
  type ApplicationTreeSelectItem,
  findTreePath,
} from "./ApplicationTreeSelect";

const UNITS: ApplicationTreeSelectItem[] = [
  {
    value: "hq",
    label: "本社",
    children: [
      { value: "sales", label: "営業部" },
      {
        value: "it",
        label: "情報システム部",
        badge: "鈴木",
        children: [
          { value: "core", label: "基幹システム課" },
          { value: "infra", label: "インフラ課", disabled: true },
        ],
      },
    ],
  },
  { value: "factory", label: "工場" },
];

// Base UI はポインタイベントの座標を見るため、happy-dom ではトリガーを click で開く。
const openPanel = async () => {
  const trigger = screen.getByRole("combobox");
  fireEvent.click(trigger);
  await waitFor(() => expect(screen.getByText("工場")).toBeTruthy());
  return trigger;
};

describe("findTreePath", () => {
  it("ルートから対象までの経路を返す", () => {
    expect(findTreePath(UNITS, "core")?.map((n) => n.value)).toEqual(["hq", "it", "core"]);
  });

  it("ルート直下も 1 要素の経路になる", () => {
    expect(findTreePath(UNITS, "factory")?.map((n) => n.value)).toEqual(["factory"]);
  });

  it("見つからなければ null を返す", () => {
    expect(findTreePath(UNITS, "unknown")).toBeNull();
  });
});

describe("ApplicationTreeSelect", () => {
  it("未選択のときは placeholder を出す", () => {
    render(<ApplicationTreeSelect items={UNITS} placeholder="組織を選択" aria-label="組織" />);
    expect(screen.getByRole("combobox").textContent).toContain("組織を選択");
  });

  it("選択すると onValueChange が呼ばれる", async () => {
    const onValueChange = vi.fn();
    render(<ApplicationTreeSelect items={UNITS} onValueChange={onValueChange} aria-label="組織" />);
    await openPanel();

    fireEvent.click(screen.getByText("工場"));
    expect(onValueChange).toHaveBeenCalledWith("factory");
  });

  it("非制御でも選択がトリガーへ反映される", async () => {
    render(<ApplicationTreeSelect items={UNITS} aria-label="組織" />);
    await openPanel();

    fireEvent.click(screen.getByText("工場"));
    await waitFor(() => expect(screen.getByRole("combobox").textContent).toContain("工場"));
  });

  it("showPath でルートからの経路を表示する", () => {
    const { rerender } = render(
      <ApplicationTreeSelect items={UNITS} value="core" aria-label="組織" />,
    );
    expect(screen.getByRole("combobox").textContent).toContain(
      "本社 / 情報システム部 / 基幹システム課",
    );

    rerender(
      <ApplicationTreeSelect items={UNITS} value="core" showPath={false} aria-label="組織" />,
    );
    const label = screen.getByRole("combobox").textContent ?? "";
    expect(label).toContain("基幹システム課");
    expect(label).not.toContain("本社 /");
  });

  it("ホバーした親の子階層が次の列に開く", async () => {
    render(<ApplicationTreeSelect items={UNITS} aria-label="組織" />);
    await openPanel();

    fireEvent.mouseEnter(screen.getByText("本社"));
    await waitFor(() => expect(screen.getByText("情報システム部")).toBeTruthy());
    expect(screen.queryByText("基幹システム課")).toBeNull();

    fireEvent.mouseEnter(screen.getByText("情報システム部"));
    await waitFor(() => expect(screen.getByText("基幹システム課")).toBeTruthy());
  });

  it("子を持たない項目へ移ると開いていた列が閉じる", async () => {
    render(<ApplicationTreeSelect items={UNITS} aria-label="組織" />);
    await openPanel();

    fireEvent.mouseEnter(screen.getByText("本社"));
    await waitFor(() => expect(screen.getByText("営業部")).toBeTruthy());

    fireEvent.mouseEnter(screen.getByText("工場"));
    await waitFor(() => expect(screen.queryByText("営業部")).toBeNull());
  });

  it("leafOnly のとき子を持つ項目は選択できない", async () => {
    const onValueChange = vi.fn();
    render(
      <ApplicationTreeSelect
        items={UNITS}
        leafOnly
        onValueChange={onValueChange}
        aria-label="組織"
      />,
    );
    await openPanel();

    fireEvent.click(screen.getByText("本社"));
    expect(onValueChange).not.toHaveBeenCalled();

    fireEvent.click(screen.getByText("工場"));
    expect(onValueChange).toHaveBeenCalledWith("factory");
  });

  it("disabled な項目は選択できない", async () => {
    const onValueChange = vi.fn();
    render(<ApplicationTreeSelect items={UNITS} onValueChange={onValueChange} aria-label="組織" />);
    await openPanel();

    fireEvent.mouseEnter(screen.getByText("本社"));
    await waitFor(() => expect(screen.getByText("情報システム部")).toBeTruthy());
    fireEvent.mouseEnter(screen.getByText("情報システム部"));
    await waitFor(() => expect(screen.getByText("インフラ課")).toBeTruthy());

    fireEvent.click(screen.getByText("インフラ課"));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("maxLevels を超える階層は開かない", async () => {
    render(<ApplicationTreeSelect items={UNITS} maxLevels={2} aria-label="組織" />);
    await openPanel();

    fireEvent.mouseEnter(screen.getByText("本社"));
    await waitFor(() => expect(screen.getByText("情報システム部")).toBeTruthy());
    fireEvent.mouseEnter(screen.getByText("情報システム部"));

    // 3 階層目にあたる子は maxLevels=2 では列に出ない
    await waitFor(() => expect(screen.queryByText("基幹システム課")).toBeNull());
  });

  it("name を渡すとフォーム送信用の hidden input を出す", () => {
    const { container } = render(
      <ApplicationTreeSelect items={UNITS} name="unit" value="core" aria-label="組織" />,
    );
    const hidden = container.querySelector<HTMLInputElement>('input[type="hidden"][name="unit"]');
    expect(hidden?.value).toBe("core");
  });

  it("name が無ければ hidden input を出さない", () => {
    const { container } = render(<ApplicationTreeSelect items={UNITS} aria-label="組織" />);
    expect(container.querySelector('input[type="hidden"]')).toBeNull();
  });

  it("error のとき aria-invalid が付く", () => {
    render(<ApplicationTreeSelect items={UNITS} error aria-label="組織" />);
    expect(screen.getByRole("combobox").getAttribute("aria-invalid")).toBe("true");
  });
});
