import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";

/**
 * scripts/rename-legacy-names.pl の fixture test。
 *
 * <important>
 * codemod は利用側 5 repository・約 1,255 箇所を一括で書き換える移行手段で、
 * 壊れ方が「黙って部分変換される」形になる。とくに `ApplicationToast` は
 *
 *   - package の export 名（→ `toast` へ改名した）
 *   - `window.ApplicationToast` のグローバル（→ 改名していない実行時契約）
 *
 * の 2 つを指し、後者を書き換えると存在しない `toast` プロパティを見に行く。
 * `any` キャスト経由だと typecheck も通るため、実行時に通知が出なくなるまで
 * 誰も気づけない。代表的な記法をここで固定する。
 * </important>
 */
const SCRIPT = join(process.cwd(), "scripts/rename-legacy-names.pl");

const workspace = mkdtempSync(join(tmpdir(), "rename-legacy-names-"));

afterAll(() => {
  rmSync(workspace, { recursive: true, force: true });
});

/** 1 ファイルへ codemod をかけ、書き換え後の中身と終了状態を返す。 */
function run(name: string, source: string): { text: string; ok: boolean; stderr: string } {
  const file = join(workspace, `${name}.ts`);
  writeFileSync(file, source, "utf-8");
  let ok = true;
  let stderr = "";
  try {
    execFileSync("perl", [SCRIPT, file], { encoding: "utf-8", stdio: ["ignore", "pipe", "pipe"] });
  } catch (error) {
    ok = false;
    stderr = String((error as { stderr?: string }).stderr ?? "");
  }
  return { text: readFileSync(file, "utf-8"), ok, stderr };
}

describe("rename-legacy-names.pl", () => {
  describe("旧名を新名へ置換する", () => {
    const CASES: [name: string, input: string, expected: string][] = [
      [
        "import 文",
        'import { ApplicationButton, ApplicationTable } from "application-ui-kit";',
        'import { Button, Table } from "application-ui-kit";',
      ],
      [
        "JSX",
        '<ApplicationButton variant="primary">保存</ApplicationButton>',
        '<Button variant="primary">保存</Button>',
      ],
      [
        "型注釈",
        "const props: ApplicationButtonProps = { variant: 'primary' };",
        "const props: ButtonProps = { variant: 'primary' };",
      ],
      ["定数", "APPLICATION_COMBOBOX_CREATE_PREFIX", "COMBOBOX_CREATE_PREFIX"],
      /* 接頭辞を外すだけだと shadcn/ui の primitive `FieldSet` と同名になる。
       * decisions/adr-0006 の「改訂」を参照。 */
      [
        "FieldSet は FormFieldSet へ（FieldSet ではない）",
        'import { ApplicationFieldSet, ApplicationFieldSetProps } from "application-ui-kit";',
        'import { FormFieldSet, FormFieldSetProps } from "application-ui-kit";',
      ],
      /* package の export 名としての ApplicationToast は小文字の toast へ。 */
      [
        "package の export としての Toast",
        'import { ApplicationToast } from "application-ui-kit";\nApplicationToast.success("保存しました");',
        'import { toast } from "application-ui-kit";\ntoast.success("保存しました");',
      ],
      /* ApplicationToast と前方一致するが別の名前。巻き込まれてはいけない。 */
      [
        "Toast と前方一致する別名",
        "type A = ApplicationToastOptions; type B = ApplicationToastType; const c = ApplicationToaster;",
        "type A = ToastOptions; type B = ToastType; const c = Toaster;",
      ],
      /* 「Application」は散文でも使う。語境界だけが頼りなので固定する。 */
      [
        "散文と package 名には当たらない",
        '// Application 側の都合で決める\nimport x from "application-ui-kit";',
        '// Application 側の都合で決める\nimport x from "application-ui-kit";',
      ],
    ];

    it.each(CASES)("%s", (_name, input, expected) => {
      const { text, ok } = run("ok", input);
      expect(ok).toBe(true);
      expect(text).toBe(expected);
    });
  });

  describe("window.ApplicationToast のグローバル契約は書き換えない", () => {
    const KEPT: [name: string, source: string][] = [
      ["ドット記法", 'window.ApplicationToast.success("ok");'],
      ["optional chaining", 'window?.ApplicationToast?.success("ok");'],
      ["globalThis", 'globalThis.ApplicationToast.success("ok");'],
      ["self", 'self.ApplicationToast.success("ok");'],
      ["as any キャスト", '(window as any).ApplicationToast.success("ok");'],
      ["ブラケット記法", '(window as any)["ApplicationToast"].success("ok");'],
      ["ブラケット記法（単引用符）", "(window as any)['ApplicationToast'].success('ok');"],
      ["window からの分割代入", "const { ApplicationToast } = window as any;"],
      ["globalThis からの分割代入", "const { ApplicationToast } = globalThis as any;"],
      /* formatter が折った形。保護も検出も全文へ当てないと片方だけ通る。 */
      ["多行の分割代入", "const {\n  ApplicationToast,\n} = window as any;"],
      ["多行のプロパティアクセス", "window\n  .ApplicationToast\n  .success('ok');"],
      /* 先頭が `.` の形は cross-frame でグローバルを指す正当な書き方なので許す。 */
      ["parent 経由の window", 'parent.window.ApplicationToast.success("ok");'],
      /* 文字列リテラルは名前そのもの。Django テンプレートと共有する契約なので
       * どこに現れても書き換えない。 */
      ["文字列リテラル", 'const key = "ApplicationToast";'],
      [
        "型宣言の中の文字列キー",
        'declare global { interface Window { "ApplicationToast": unknown } }',
      ],
    ];

    it.each(KEPT)("%s はそのまま残る", (_name, source) => {
      const { text, ok } = run("kept", source);
      expect(ok).toBe(true);
      expect(text).toBe(source);
    });

    it("同じファイルの中で export 名だけを置換し、グローバルは残す", () => {
      const { text, ok } = run(
        "mixed",
        [
          'import { ApplicationToast } from "application-ui-kit";',
          'ApplicationToast.success("package 経由");',
          'window.ApplicationToast.success("グローバル経由");',
        ].join("\n"),
      );
      expect(ok).toBe(true);
      expect(text).toBe(
        [
          'import { toast } from "application-ui-kit";',
          'toast.success("package 経由");',
          'window.ApplicationToast.success("グローバル経由");',
        ].join("\n"),
      );
    });
  });

  /* 「黙って部分変換しない」ことが codemod の最低条件。判別できない書き方は
   * ファイルを触らずに落ちる。 */
  describe("判別できない書き方は失敗させる", () => {
    const AMBIGUOUS: [name: string, source: string][] = [
      [
        "window を別名に入れてからのアクセス",
        'const w = window as any;\nw.ApplicationToast.success("ok");',
      ],
      ["受け側の分からない分割代入", "const { ApplicationToast } = getGlobals();"],
      ["this 経由のアクセス", 'this.ApplicationToast.success("ok");'],
      /* 末尾が window / self で終わる別の識別子。先頭側に識別子境界がないと
       * グローバル契約として保護され、警告もなく素通りしていた。 */
      ["window で終わる別の識別子", 'uiwindow.ApplicationToast.success("ok");'],
      ["self で終わる別の識別子", 'itself.ApplicationToast.success("ok");'],
      /* JS の識別子には `$` が使える。`\b` では弾けないので lookbehind が要る。 */
      ["$ 始まりの識別子", 'const $window = getKit();\n$window.ApplicationToast.success("ok");'],
      /* formatter が折ると `{`〜`}` と `=` が同じ行に載らない。行ごとに当てて
       * いると検出をすり抜け、素の識別子として `toast` へ書き換わっていた。 */
      ["多行の分割代入（受け側が分からない）", "const {\n  ApplicationToast,\n} = getGlobals();"],
      [
        "多行のプロパティアクセス（受け側が分からない）",
        "const w = window as any;\nw\n  .ApplicationToast\n  .success('ok');",
      ],
    ];

    it.each(AMBIGUOUS)("%s は書き換えずに失敗する", (_name, source) => {
      const { text, ok, stderr } = run("ambiguous", source);
      expect(ok).toBe(false);
      expect(text).toBe(source);
      expect(stderr).toContain("ApplicationToast");
    });

    it("失敗したファイルの中の他の旧名も書き換えない（部分変換を作らない）", () => {
      const source = [
        'import { ApplicationButton } from "application-ui-kit";',
        "const w = window as any;",
        'w.ApplicationToast.success("ok");',
      ].join("\n");
      const { text, ok } = run("ambiguous-mixed", source);
      expect(ok).toBe(false);
      expect(text).toBe(source);
    });
  });
});
