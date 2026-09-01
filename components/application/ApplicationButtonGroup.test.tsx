import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ApplicationButtonGroup, type ApplicationButtonGroupItem } from "./ApplicationButtonGroup";

const PERIODS: ApplicationButtonGroupItem[] = [
  { value: "day", label: "日" },
  { value: "week", label: "週" },
  { value: "month", label: "月" },
];

describe("ApplicationButtonGroup", () => {
  it("選択すると onValueChange が呼ばれる", () => {
    const onValueChange = vi.fn();
    render(
      <ApplicationButtonGroup
        items={PERIODS}
        defaultValue="day"
        onValueChange={onValueChange}
        aria-label="表示期間"
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "週" }));
    expect(onValueChange).toHaveBeenCalledWith("week");
  });

  describe("フォーム送信", () => {
    /* type="hidden" にすると required が検証されない
     * （hidden input は barred from constraint validation）。
     * 未選択のままフォームが valid になり name="" が送信されるため、
     * 視覚的に隠すだけの input であることを固定する。 */
    it("required で未選択ならフォームが invalid になる", () => {
      const { container } = render(
        <form>
          <ApplicationButtonGroup items={PERIODS} name="period" required aria-label="表示期間" />
        </form>,
      );
      const form = container.querySelector("form") as HTMLFormElement;
      const field = container.querySelector('input[name="period"]') as HTMLInputElement;

      expect(field.type).not.toBe("hidden");
      expect(field.value).toBe("");
      expect(form.checkValidity()).toBe(false);
    });

    it("選択済みならフォームが valid になり、選択値を送信する", () => {
      const { container } = render(
        <form>
          <ApplicationButtonGroup
            items={PERIODS}
            name="period"
            required
            defaultValue="week"
            aria-label="表示期間"
          />
        </form>,
      );
      const form = container.querySelector("form") as HTMLFormElement;
      const field = container.querySelector('input[name="period"]') as HTMLInputElement;

      expect(field.value).toBe("week");
      expect(form.checkValidity()).toBe(true);
    });

    it("送信用の input は Tab の順路と読み上げから外す", () => {
      const { container } = render(
        <ApplicationButtonGroup
          items={PERIODS}
          name="period"
          defaultValue="day"
          aria-label="表示期間"
        />,
      );
      const field = container.querySelector('input[name="period"]') as HTMLInputElement;
      expect(field.tabIndex).toBe(-1);
      expect(field.getAttribute("aria-hidden")).toBe("true");
      expect(field.className).toContain("sr-only");
    });

    it("name が無ければ送信用の input を出さない", () => {
      const { container } = render(
        <ApplicationButtonGroup items={PERIODS} defaultValue="day" aria-label="表示期間" />,
      );
      expect(container.querySelector("input[name]")).toBeNull();
    });

    it("required なしなら未選択でも valid", () => {
      const { container } = render(
        <form>
          <ApplicationButtonGroup items={PERIODS} name="period" aria-label="表示期間" />
        </form>,
      );
      expect((container.querySelector("form") as HTMLFormElement).checkValidity()).toBe(true);
    });
  });
});
