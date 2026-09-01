# design-sync notes

## General fixes (apply automatically via config on future syncs)

- **`projectId` is deliberately not committed in `config.json`.** The target Claude Design project differs per owner/fork, so pinning one here would push every fork's sync at a single org's project. Pass the target project at sync time instead (`/design-sync --project <uuid>`, or pick from `list_projects`).
- **`pkg` uses the owner-independent consumer name `application-ui-kit`.** GitHub Packages publishes the physical package as `@<owner>/application-ui-kit`, but consumer code resolves it through the npm alias defined in the consuming application's `package.json`. Keeping design-sync on the same logical package name prevents fork-specific source diffs.

- **[GENERAL] Fixed viewport clips tall Overview stories.** `compare.mjs`'s per-story capture screenshots the DS preview at a *fixed* viewport (default 900x700, `page.screenshot({fullPage:false})`), while the storybook reference side captures the real element and auto-sizes to its content. Any story taller than the viewport is silently cropped in the DS capture with **no validate warning** — the sheet/thumbnail can look fine at a glance while the raw PNG is missing content. Discovered on `ApplicationNavItem`'s Overview story (1040px of real content, cropped to 700px, hiding the `amber`/`rose`/`emerald` swatches and the whole `LINK / BUTTON` section). Checked all 21 components' storybook-side raw PNG heights against 700px and found 9 affected; fixed via `cfg.overrides.<Name>.viewport`:
  `ApplicationTable` (900x1150), `ApplicationNavItem` (900x1100), `ApplicationFormField` (900x1020), `ApplicationInput` (900x980), `ApplicationButtonGroup` (900x900), `ApplicationCombobox` (900x870), `ApplicationDatePicker` (900x870), `ApplicationRadioGroup` (900x850), `ApplicationSelect` (900x780).
  **Re-check this on every re-sync**: if any component's Overview (or any) story grows past its configured viewport height, it will crop again silently — measure the storybook-side raw PNG height and bump the override if needed.
- **[GENERAL] `.storybook/preview.tsx` decorator never bundles for previews** (`! preview decorator bundle failed: Could not resolve "tailwindcss"` — the decorator's CSS import chain only resolves through the `@tailwindcss/vite` plugin, not esbuild). This means previews never get the decorator's `.dark`-class toggle, the `app-preview font-sans p-6` wrapper div, or the always-mounted `<ApplicationToaster />`. Verified harmless for all 21 currently-synced components (colors/fonts come from the `[CSS_FROM_STORYBOOK]` fallback regardless; `ApplicationThemeToggle` manages its own `.dark` toggle internally; toast stories only render trigger buttons, not the toast itself). **Risk**: a future component whose *default* (non-interactive) render depends on being inside `.dark` or on `ApplicationToaster` being mounted would silently regress without this being caught by validate — no `cfg.provider` has been set because it wasn't needed.
- **[GENERAL] `[TOKENS_MISSING]` for `--tw`, `--toast-index`, `--toast-swipe-movement-x/y`, `--toast-height`, `--toast-offset-y`** — confirmed these are set at runtime by the toast/base-ui primitives, not sourced from a stylesheet; toast stories render correctly. No `cfg.tokensPkg` needed.
- **[GENERAL] トークン抽出が Tailwind v4 のコンパイル出力を DS トークンとして拾う。** check が
  (1) component-style セレクタ配下の custom property 112件（`.cn-button:focus-visible` 等）と
  (2) 分類できないトークン 38種 を報告したが、どちらも誤検知。原因は共通で、トークン抽出が
  `[CSS_FROM_STORYBOOK]` フォールバック（= Tailwind がコンパイルした Storybook の CSS）を
  読んでいること。オーサリング元の `tokens/*.css` には `--tw-` は 1 個も無い
  （`grep -c -- "--tw-" tokens/components.css` → 0）。内訳と対応:
  - **`--tw-*`（(1) の全件 + (2) の 25種）** = Tailwind の box-shadow / transform / animation 合成用の
    作業変数。`.cn-button:focus-visible` 側の `--tw-ring-shadow` / `--tw-ring-offset-width` は
    **`:root` へ移してはいけない**（ring が全要素に効いて壊れる）。実テーマ値は
    `--tw-ring-color: var(--color-ring)` として正しく参照されており `--color-ring` は登録済み。
    → `cfg.tokensIgnore` に `"--tw-*"` を入れて名前空間ごと除外。
  - **モーショントークン 7種** = 本物。`--motion-duration-fast` / `--motion-duration-base` /
    `--motion-ease-default` / `--default-transition-duration` /
    `--default-transition-timing-function` / `--animate-spin` / `--animate-pulse`。
    check 側に motion の分類が無いため定義箇所に `/* @kind other */` を付けた
    （`tokens/motion.css`）。`--motion-*` は名前空間ごと注釈してある（名指しされた 3 種だけ
    でなく `-slow` / `-ease-out` / `-delay-*` も含む）ので、次に別の値が出ても再発しない。
    後ろの 4 種は **リポジトリ内に定義箇所が無かった**（Tailwind のデフォルトテーマ由来）ため、
    注釈を付けられるよう `@theme` へ明示的にピン留めした。値はコンパイル結果を実測して
    既定値と一致させてあり、ビルド前後の CSS を正規化 diff して出力がバイト一致・
    `@keyframes spin` / `pulse` も消えないことを確認済み（挙動は変わらない）。
  - **コンポーネント内部変数 4種** = `--lk-halfstep`（`tokens/scale.css`）、`--lk-state-hover`、
    `--lk-state-active`、`--icon-empty`（`tokens/icon-metrics.generated.css`）。
    → `cfg.tokensIgnore` に名指しで追加。
    **名前空間ごと（`--lk-*` / `--icon-*`）は除外していない**: 兄弟の `--lk-icon-air` /
    `--lk-icon-gap` / `--lk-icon-inset` / `--lk-state-*-on-fill` / `--icon-box` / `--icon-fix` は
    check に分類できており、namespace 除外にすると登録済みトークンを落とすことになるため。
    今後それらが「分類できない」に出てきたら、そのとき名指しで足す。

- **[GENERAL] `cfg.tokensIgnore` のキー名は未検証。** 上記の除外を書いたが、driver / converter の
  ソースがローカルに無く、`tokensIgnore` というキー名が実際に driver に読まれるかを確認できて
  いない（DesignSync も design-system authorization 無しでは叩けない）。driver が知らないキーは
  黙って無視されるだけなので害は無いが、**次回 `/design-sync` を回したら check の残件数を
  必ず確認すること**。0件にならず `--tw-*` がまだ出るなら、キー名が違う。
  判明している近縁のキーは `cfg.tokensPkg`（トークンの供給元パッケージ）と
  `cfg.tokensGlob`（package shape 専用）で、**`tokensPkg` を設定して抽出元をコンパイル済み
  Storybook CSS からパッケージ自身の `./styles.css`（= `tokens/theme.css`）に切り替えるのが
  代替の直し方**。ソース側には `--tw-*` が存在しないので、それだけで (1) と (2)(a) は根本から消える。

- **[GENERAL] 「ダークテーマ未定義」は誤検知。対応不要。** `.dark` スコープの surface /
  foreground / border 上書きセットは `tokens/theme.css` の `.dark` ブロックに定義済みで、
  コンパイル結果にも `.dark{--color-background:…}` として 17 プロパティ分が出ている
  （`storybook-static` の CSS で実測確認）。このリポジトリは Tailwind 既定の
  `@media (prefers-color-scheme: dark)` ではなく
  `@custom-variant dark (&:where(.dark, .dark *))` によるクラス方式オプトインを
  **意図的に**採っている（理由は theme.css のコメント: 利用側テンプレートが `bg-white` 直書きの
  ままだと OS 設定だけで画面が半分暗くなって破綻する）。check が `prefers-color-scheme` か
  `[data-theme]` を探しているなら `.dark` を見落とす。
  **`@media (prefers-color-scheme: dark)` を足してはいけない** — 上の設計判断を直接壊す。

- **[GENERAL] この `.design-sync/` の内容は必ず commit すること。** 上記の調査結果は一度
  未 commit のまま作業ツリーごと失われている（repository の 1.0 再基準化に伴う再 clone）。
  `config.json` / `NOTES.md` / `conventions.md` はいずれも生成物ではなく手で維持する設定・記録で、
  失うと同じ調査をやり直すことになる。

- `ApplicationPagination` Overview story overflowed its grid cell width (`[GRID_OVERFLOW] ... wide`) — fixed via `cfg.overrides.ApplicationPagination.cardMode: "column"`.

## Cosmetic changes worth knowing about

- **Catalog grouping flattened from curated subgroups to a flat "components" group.** The previously-uploaded project organized cards into `data-display`/`forms`/`actions`/`overlays`/`navigation`/`primitives`/`surfaces` — but every story title in this repo (`stories/components/*.stories.tsx`) is a flat two-level `Components/<Name>`, and group is derived mechanically from the title segment above the component name (`common.mjs#titleParts`). Checked git blame — these titles have always been flat two-level for every file checked, so the old subgrouping was almost certainly hand-curated via a `cfg.titleMap`/fork config from a prior sync we have no record of (see "lost local state" below), not something this repo's stories ever encoded. The driver's diff correctly treated this as a "pure regroup" (its `deletePaths` remove every component's old grouped path alongside the new flat path in `writes`) rather than a contract change, so no grades were lost. If the curated subgroups are wanted back, either restructure story titles to `Components/<Category>/<Name>` in the repo, or reintroduce a group-remapping config — there is currently no `cfg` knob that overrides `group` independent of the title path.

## Re-sync risks

- **9 primitives lost their standalone stories, not their exports.** `Card`, `Empty`, `Field`, `Item`, `Label`, `Progress`, `Separator`, `Spinner`, `Textarea` are still re-exported as plain shadcn/ui passthroughs from `components/application/index.ts`, but commit `ff5c673` ("shadcn/ui gen3 (Base UI) へ移行し、公開APIを整理する") removed their dedicated `.stories.tsx` files — they now only appear embedded inside Pattern/Template stories (`Form`, `EmptyState`, `gallery/AllComponents`, etc.). This sync correctly reports them as `removed` and drops their cards, since the storybook shape can only verify components with their own stories. If standalone Catalog cards are wanted again for these, they need dedicated story files restored.
- **`ApplicationActiveIndicator` is invisible to this sync.** It exists in the compiled `dist/`/exports but has no story anywhere under `stories/`, so the converter never considers it (not `added`, not `removed` — just never seen). Confirm with the team whether it's meant to be Catalog-visible; if so it needs a story.
- **This session started from a lost local `.design-sync/` state.** The Claude Design project this repo syncs into already held a complete prior sync, but this repo checkout had no `.design-sync/config.json`, no `NOTES.md`, and no `previews/` overrides — they were apparently never committed before a prior session's container was recycled (this is an ephemeral remote-execution repo). No owned preview overrides were needed this run (every component rendered correctly from the generated wrapper), but there's no history of *why* past fixes were made. This NOTES.md is the first durable record — keep it committed on every future sync.
- **`docs: 0/21 components matched` in the build log.** The converter's doc discovery (`cfg.docsMap`/`cfg.dtsPropsFor`) found no matching source docs for any component, so `.prompt.md` content is generated from `.d.ts` + story source only, not from the components' own JSDoc comments (which are often rich, e.g. `ApplicationButton.tsx`'s variant descriptions). Not a blocker, but a future sync could investigate `cfg.componentSrcMap`/`cfg.docsMap` to surface those JSDoc blocks in the generated prompt docs.
