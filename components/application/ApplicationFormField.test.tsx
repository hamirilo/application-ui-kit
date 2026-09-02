import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { Textarea } from "../ui/textarea";
import { ApplicationCombobox } from "./ApplicationCombobox";
import { ApplicationFormField } from "./ApplicationFormField";
import { ApplicationInput } from "./ApplicationInput";
import { ApplicationSelect } from "./ApplicationSelect";

/**
 * shadcn/ui のエラー表現は 2 本立てで、両方が必要。
 *
 *   Field に data-invalid   … 見た目（.cn-field の data-[invalid=true]）
 *   コントロールに aria-invalid … 支援技術
 *
 * どちらも「独自 prop を挟まない」ことが前提なので、注入するのは標準属性だけ。
 * 個別コンポーネントの test では気づけない結線なので、ここで横断的に固定する。
 */

const ITEMS = [
  { value: "a", label: "A" },
  { value: "b", label: "B" },
];

/** ApplicationFormField の子として現実的に渡されるもの */
const CONTROLS = [
  { name: "ApplicationInput", render: () => <ApplicationInput /> },
  { name: "ApplicationSelect", render: () => <ApplicationSelect items={ITEMS} /> },
  { name: "ApplicationCombobox", render: () => <ApplicationCombobox items={ITEMS} /> },
  { name: "Textarea", render: () => <Textarea /> },
] as const;

/** Field（role="group" + data-slot="field"）を取り出す */
function field(container: HTMLElement): HTMLElement {
  return container.querySelector('[data-slot="field"]') as HTMLElement;
}

/** aria-invalid が付いた要素（= 各部品が「自分のコントロール」と決めた要素） */
function invalidControl(container: HTMLElement): HTMLElement | null {
  return container.querySelector("[aria-invalid]");
}

describe("ApplicationFormField × 各コントロールの結線", () => {
  describe.each(CONTROLS)("$name", ({ render: renderControl }) => {
    it("error があると Field に data-invalid が付く", () => {
      const { container } = render(
        <ApplicationFormField label="件名" error="入力してください">
          {renderControl()}
        </ApplicationFormField>,
      );
      expect(field(container).getAttribute("data-invalid")).toBe("true");
    });

    it("error が無ければ data-invalid を付けない", () => {
      const { container } = render(
        <ApplicationFormField label="件名">{renderControl()}</ApplicationFormField>,
      );
      expect(field(container).hasAttribute("data-invalid")).toBe(false);
    });

    it("error があるとコントロールに aria-invalid が付く", () => {
      const { container } = render(
        <ApplicationFormField label="件名" error="入力してください">
          {renderControl()}
        </ApplicationFormField>,
      );
      expect(invalidControl(container)?.getAttribute("aria-invalid")).toBe("true");
    });

    /* 以前は独自 prop の `error` も注入しており、受け取らない子では DOM へ漏れて
     * React が毎レンダー警告していた（vitest.setup.ts がその警告を落とす）。 */
    it("独自 prop の error を DOM へ漏らさない", () => {
      const { container } = render(
        <ApplicationFormField label="件名" error="入力してください">
          {renderControl()}
        </ApplicationFormField>,
      );
      expect(container.querySelector("[error]")).toBeNull();
    });

    it("ラベルの htmlFor が実在する要素を指す", () => {
      const { container } = render(
        <ApplicationFormField label="件名">{renderControl()}</ApplicationFormField>,
      );
      const htmlFor = container.querySelector("label")?.getAttribute("for");
      expect(htmlFor).toBeTruthy();
      expect(document.getElementById(htmlFor as string)).not.toBeNull();
    });

    it("error と helpText の id が aria-describedby に入る", () => {
      const { container } = render(
        <ApplicationFormField label="件名" error="入力してください" helpText="50文字以内">
          {renderControl()}
        </ApplicationFormField>,
      );
      const describedBy = container
        .querySelector("[aria-describedby]")
        ?.getAttribute("aria-describedby");
      expect(describedBy).toBeTruthy();
      for (const id of (describedBy as string).split(" ")) {
        expect(document.getElementById(id)?.textContent).toBeTruthy();
      }
    });
  });

  /* ApplicationFormField は error が無いときも aria-invalid: undefined を注入する。
   * 受け取り側が `{...props}` を後に spread していると、自前で立てた aria-invalid が
   * 消える。ApplicationButtonGroup で一度踏んでいる不具合なので全部品で固定する。 */
  describe("コントロール側の error を潰さない（spread 順の回帰）", () => {
    it("ApplicationInput", () => {
      const { container } = render(
        <ApplicationFormField label="件名">
          <ApplicationInput error />
        </ApplicationFormField>,
      );
      expect(container.querySelector("input")?.getAttribute("aria-invalid")).toBe("true");
    });

    it("ApplicationSelect", () => {
      render(
        <ApplicationFormField label="部署">
          <ApplicationSelect items={ITEMS} error />
        </ApplicationFormField>,
      );
      expect(screen.getByRole("combobox").getAttribute("aria-invalid")).toBe("true");
    });

    it("ApplicationCombobox", () => {
      render(
        <ApplicationFormField label="部署">
          <ApplicationCombobox items={ITEMS} error aria-label="部署" />
        </ApplicationFormField>,
      );
      expect(screen.getByRole("combobox").getAttribute("aria-invalid")).toBe("true");
    });
  });

  it("単体利用（ApplicationFormField 無し）でも error が aria-invalid になる", () => {
    render(<ApplicationSelect items={ITEMS} error aria-label="部署" />);
    expect(screen.getByRole("combobox").getAttribute("aria-invalid")).toBe("true");
  });
});
