import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import * as publicApi from "./index";

/**
 * design-system/ が公開部品として挙げている名前が、実際に配布エントリから
 * export されているかを固定する。
 *
 * <important>
 * このズレは既存のどのゲートでも検出できなかった。typecheck / build は
 * 未 export でも通り、verify:package の fixture は `import * as kit` で
 * **意図的に名前非依存**にしてある（export の増減に追従させないため）。
 * その結果 ApplicationActiveIndicator は design-system が公開部品として
 * 案内しているのに index.ts に無く、dist に出ていても consumer からは
 * 一切参照できない状態が残っていた。
 *
 * design-system/ は Claude Design と人間が「まず既存の部品を使う」ために
 * 読む面なので、ここに載っている名前は必ず引けなければならない。
 * </important>
 *
 * 名前をこのファイルへ直接列挙しないのは、部品を増やすたびに 2 箇所を
 * 直す運用になると、いずれ片方が忘れられて同じことが起きるため。
 * 正は design-system/ のドキュメントそのものにする。
 */
const DOCS = ["design-system/README.md", "design-system/component-usage.md"];

/** `Application` だけの語（総称としての「Application UI Kit」等）は部品名ではない */
function componentNamesIn(markdown: string): string[] {
  return [...markdown.matchAll(/\bApplication[A-Z][A-Za-z]*\b/g)].map((m) => m[0]);
}

describe("design-system が挙げる公開部品", () => {
  const documented = new Set(
    DOCS.flatMap((f) => componentNamesIn(readFileSync(join(process.cwd(), f), "utf-8"))),
  );

  it("ドキュメントから部品名を拾えている（正規表現が空振りしていない）", () => {
    expect(documented.size).toBeGreaterThan(10);
  });

  it.each([...documented].sort())("%s が index.ts から export されている", (name) => {
    expect(publicApi).toHaveProperty(name);
    expect((publicApi as Record<string, unknown>)[name]).toBeDefined();
  });
});
