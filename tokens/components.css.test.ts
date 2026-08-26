import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Base UI の Checkbox.Root / RadioGroupItem は <button> ではなく
 * <span role="..."> を描画する。display を明示しない cn-* クラスは
 * inline のままになり、size-* が無視されて border だけの線に潰れる
 * （ラベル付きは flex 子として blockify されるため偶然直ってしまい、
 * typecheck / test / build では気づけない）。ここで宣言を固定する。
 */
const css = readFileSync(join(process.cwd(), "tokens/components.css"), "utf-8");

function ruleBody(selector: string): string {
  const start = css.indexOf(`${selector} {`);
  expect(start, `${selector} が見つからない`).toBeGreaterThan(-1);
  return css.slice(start, css.indexOf("}", start));
}

describe("tokens/components.css", () => {
  it("cn-checkbox は display を明示する", () => {
    expect(ruleBody(".cn-checkbox")).toMatch(/\b(inline-flex|flex|inline-grid|grid)\b/);
  });

  it("cn-radio-group-item は display を明示する", () => {
    expect(ruleBody(".cn-radio-group-item")).toMatch(/\b(inline-flex|flex|inline-grid|grid)\b/);
  });
});
