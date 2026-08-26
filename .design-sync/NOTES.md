# design-sync ノート（@hamirilo/application-ui-kit）

claude.ai/design への同期で判明したこのリポジトリ固有の事情。次回の同期はここを先に読むこと。

## 環境・ビルド手順

- パッケージマネージャは **bun**（`bun.lock`）。`bun install --frozen-lockfile` → `bun run build`。
- コンバータのエントリは `./dist/components/application/index.js`
  （`package.json` の `module` が指す先。`--entry` で明示的に渡す必要がある）。
- `--node-modules` はリポジトリルートの `./node_modules`（monorepo ではないためルートで正しい）。
- 参照 Storybook は
  `npx storybook build -c .storybook -o "$(git rev-parse --show-toplevel)/.design-sync/sb-reference"`。
  `bun run build-storybook` は出力先が `storybook-static` になるため **使わない**。
- 現状 238 entries → 30 コンポーネント、203 stories。
- compare は **`--max-stories 13`** で回す。既定の 6 では 30 コンポーネント中 16 個で
  末尾のストーリーが未採点のまま「アップロード済みで検証済み」扱いになるため。

## カードのグループ（Storybook の title が正）

`@dsCard` の `group` は **Storybook の `title` の先頭セグメント**から決まる
（`lib/common.mjs` の `titleParts`: 小文字化し非英数字を `-` に変換）。
`Data Display/ApplicationTable` → `data-display`。ディレクトリ構成は無関係。

現在の 7 グループ:

| title 接頭辞 | group | 中身 |
|---|---|---|
| `Primitives/` | `primitives` | Spinner, Separator, Label |
| `Actions/` | `actions` | ApplicationButton, ApplicationButtonGroup, ApplicationDropdown, ApplicationThemeToggle |
| `Forms/` | `forms` | ApplicationInput, ApplicationSearchInput, ApplicationSelect, ApplicationCombobox, ApplicationCheckbox, ApplicationRadioGroup, ApplicationDatePicker, ApplicationFormField, Textarea, Field |
| `Data Display/` | `data-display` | ApplicationTable, ApplicationBadge, ApplicationPagination, Item, Progress, Empty |
| `Navigation/` | `navigation` | ApplicationNavItem, ApplicationTabs |
| `Overlays/` | `overlays` | ApplicationDialog, ApplicationConfirmDialog, ApplicationFormDialog, ApplicationToast |
| `Surfaces/` | `surfaces` | Card |

MDX の解説は `Foundations/*` を使っている。プリミティブ側を `Foundation/` にすると
サイドバーで紛らわしいため **`Primitives/`** にした。変えないこと。

**title を変えるとカードのパスが変わる**（`components/<group>/<Name>/`）。
アップロード後に変えると全パスの再アップロードと旧パス削除が必要になるので、
グループ変更は同期前に済ませる。

## 既知の警告（対応済み・または対応不要）

- **`[TOKENS_MISSING]` — 対応不要。** `--tw`（Tailwind v4 内部）と `--toast-index` /
  `--toast-height` / `--toast-offset-y` / `--toast-swipe-movement-{x,y}` の 6 件。
  後者は Base UI の Toast プリミティブが実行時にインライン style で各トーストノードへ
  書き込むもので、`z-[calc(1000-var(--toast-index))]` のような Tailwind arbitrary value
  から参照される。静的スタイルシートに定義が無いのが正しい状態。追いかけないこと。
- **`[TITLE_UNMAPPED]` — 対応済み。** `stories/patterns/` と `stories/gallery/` は
  パターン集でありコンポーネント export ではない。`titleMap` で明示的に `null` 除外済み
  （Form / EmptyState / ErrorState / Search / DataTable / ButtonGroupExample / AllComponents）。
  **`stories/patterns/` にファイルを追加したら `titleMap` に `null` を足す。**
- **`[GRID_OVERFLOW]` ApplicationPagination — 対応済み。** `cardMode: "column"`。
- **`[GRID_OVERFLOW]` Progress — `cardMode: "column"` で対応。警告は残るが正常。**
  原因は `cfg.provider`（下記）が全プレビューに **空の position:fixed なトースト
  viewport** を差し込むこと。検出器はこれを「セル外に出る内容」と見る。
  推奨は `cardMode: "single"` だが、それだと 4 ストーリー中 1 つしか出ず
  「値ごとのバーを見比べる」というカードの価値が失われる。`column` にすると
  1 ストーリー 1 行フル幅で 4 つ全部残り、実際のカード描画もきれいになる
  （`_screenshots/data-display__Progress.png` で確認済み）。escape 判定は
  仕様上 `column` では消えないので、**この警告は既知として無視してよい**。
- **`[CSS_FROM_STORYBOOK]` — 現状これが正しい。** Tailwind v4 を `@tailwindcss/vite` で
  解決しているため配布物に単体の完成 CSS が無い。コンバータは参照 Storybook がビルドした
  CSS（163KB、Tailwind + token 解決済み）を `_ds_bundle.css` として採用する。
- **`[DTS_STYLE_SYSTEM]`** — shadcn 再 export は `React.ComponentProps<"div">` 等が土台で
  CSS 名の props が多いため出る。実 API ではないので対応不要。

## cfg.provider = ApplicationToaster について

`ApplicationToaster`（= `components/ui/toast.tsx` の `Toaster`）は `children` を
`ToastProvider` で包んでから portal/viewport を足す実装なので、そのまま provider に使える。

**設定している理由は「生成される案内」のため。** `cfg.provider` を設定すると
README と全 `.prompt.md` に「ツリーを `<ApplicationToaster>` で包め」という記述が入る。
実アプリでも Toaster はルート付近に 1 つ必要なので、この案内は正しい。

**ただし生成文は不正確**: 「components read theme/i18n from that context」と書かれるが、
`ApplicationToaster` が提供するのはトーストマネージャだけで theme も i18n も持たない
（theme は `<html class="dark">`）。**`.design-sync/conventions.md` で明示的に訂正している。**

代償は上記 Progress の警告のみ。全 30 プレビューは 30/30 正常描画する。

## やって駄目だったこと（再挑戦しないこと）

- **`ApplicationToast` の `Appearance` ストーリー（マウント時に 4 種のトーストを出して
  見た目を見本にする）は機能しない。** 削除済み。
  `React.useEffect` で `ApplicationToast.success(...)` 等を呼んでも、Storybook 側・
  プレビュー側・出荷されるカード描画の **3 つすべてで 1 つも表示されなかった**
  （`_screenshots/overlays__ApplicationToast.png` と compare の raw 画像で確認）。
  Toaster が購読を始める前に発火した分は捨てられるものと見られる。
  トーストは命令的かつ一時的なので、**静的なカードで見た目を見せることはできない**。
  見た目の説明は文章（conventions.md / prompt.md）で担保する方針にした。

## リポジトリ側に入れた変更（design-sync 由来）

- `biome.json` の `files.ignore` に `**/.design-sync/**` / `**/.ds-sync/**` /
  `**/ds-bundle/**` を追加。これが無いと生成物を biome が検査して
  `bun run lint` が数千件のエラーで落ちる。
- `vitest.config.ts` に `exclude` を追加（`**/.claude/**` / `**/ds-bundle/**` /
  `**/.ds-sync/**`）。`.claude/worktrees/*` には別ブランチの作業中コードが入るため、
  除外しないと**無関係な worktree の失敗で本体の `bun run test` ゲートが落ちる**
  （実際に 1 件落ちた）。

## 未解決 / 次回の判断が必要なもの

- **`docs: 0/30`** — コンポーネント単位のドキュメントが無いため `.prompt.md` は
  `.d.ts` とプレビューから合成されている。`design-system/*.md` は `guidelinesGlob` で
  `guidelines/` に 4 ファイル同梱済み（コンポーネント単位の docs とは別枠）。
  コンポーネント単位で書くなら `cfg.docsDir` を設定する。
- **`ApplicationTable` の行選択チェックボックスが約 2px の縦線に潰れる。**
  Storybook 側でも同じなので同期の問題ではなく **v5.1.0 の描画バグ**。
  別タスクとして起票済み。直ったら `sb-reference` を作り直して再同期すること。

## Re-sync risks（次回、黙って古くなりうるもの）

- **`_ds_bundle.css` は参照 Storybook のビルド成果物由来。**
  token / `cn-*` を変えたら **`sb-reference` の再ビルドが必須**。忘れると
  プレビューは古いデザインのまま同期される。`[REFERENCE_STALE?]` が出たら必ず作り直す。
- `.storybook/preview.tsx` の decorator は **バンドルできない**
  （`storybook.css` 経由で `@import "tailwindcss"` に到達し esbuild が解決できない）。
  今は `cfg.provider` で代替しているため、**将来 decorator に context 依存のもの
  （i18n、テーマ Provider 等）を足しても、プレビューは黙ってそれを失う。**
  decorator を増やしたら `cfg.provider` も更新すること。
- グループは Storybook の `title` に依存している。title を変えるとカードのパスが変わる。
- 同期先 `7b3fbcce-f433-4f60-87d1-48ff86e627b8` は **2026-08-26 に上書き済み**
  （ユーザー承諾済み）。旧 v3.0.0 の手作りコンテンツ（ui_kits / templates /
  guidelines 21枚 / SKILL.md / assets/icons / tokens/*.css）は削除した。復元はできない。
  この回で `_ds_sync.json`（検証アンカー）を初めてアップロードしたので、
  **次回以降は `resync.mjs --remote` で差分同期になる**（アンカーを
  `DesignSync(get_file, "_ds_sync.json")` で取得して渡す）。
- `.design-sync/previews/` は空。全 30 コンポーネントの生成プレビューが
  そのまま Storybook と一致したため、owned preview は 1 つも要らなかった。
  ここにファイルが増えたら「生成物では足りなかった」という記録になる。
