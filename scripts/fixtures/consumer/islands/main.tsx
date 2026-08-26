/* パッケージの export 面をまとめて触る。
 *
 * 名前を列挙せず namespace import にしているのは、export が増減しても
 * fixture を追従させなくて済むようにするため。非巻き上げレイアウトでは、
 * パッケージが package.json に宣言していない依存 (phantom dependency) を
 * ここで解決できずビルドが落ちる。 */
import * as kit from "@hamirilo/application-ui-kit";
import * as islands from "@hamirilo/application-ui-kit/islands";

// 副作用エントリ。import しただけで data-react 要素を自動マウントする。
import "@hamirilo/application-ui-kit/islands/auto-mount";

const surface: Record<string, unknown> = { ...kit, ...islands };

if (Object.keys(surface).length === 0) {
  throw new Error("パッケージから export が 1 つも読めていません");
}

const missing = Object.entries(surface)
  .filter(([, value]) => value === undefined)
  .map(([name]) => name);

if (missing.length > 0) {
  throw new Error(`export が欠けています: ${missing.join(", ")}`);
}

// rollup が未使用として落とさないよう、実体を副作用のある形で参照する。
(globalThis as Record<string, unknown>).__applicationUiKitVerify = surface;
