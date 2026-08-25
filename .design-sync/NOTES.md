# design-sync notes — @hamirilo/application-ui-kit

Repo-specific findings for future syncs. Read this before touching anything.

## Setup facts

- Shape: **storybook**. Config at `.storybook/main.ts` (repo root). Stories in `stories/**`.
- Package manager is **bun** (`bun.lock`) — install with `bun install --frozen-lockfile`, build with `bun run build`.
- Converter invocation that works here:
  `node .ds-sync/package-build.mjs --config .design-sync/config.json --node-modules ./node_modules --entry dist/components/application/index.js --out ./ds-bundle`
  `--entry` is required: this is the package's own source repo, so `node_modules/@hamirilo/application-ui-kit` does not exist.
- Global name: `window.HamiriloApplicationUiKit`.

## [GENERAL] Decorator bundle fails — and that is OK here

- Symptom: `! preview decorator bundle failed: Could not resolve "tailwindcss"`.
- Root cause: `.storybook/preview.tsx` imports `./storybook.css`, whose first line is `@import "tailwindcss"`. esbuild cannot resolve the Tailwind v4 entry outside the vite plugin.
- Fix: **none needed — do NOT set `cfg.provider`.** Verified across the solo set (Button/Dialog/Table/ThemeToggle/Toast): previews match the storybook reference exactly without the decorators, because
  - component CSS + fonts arrive via `[CSS_FROM_STORYBOOK]` (the compiled `sb-reference` stylesheet), not via the decorator;
  - the theme is a `.dark` **class on `documentElement`**, not React context — light is the default and needs no wrapper;
  - `<ApplicationToaster />` (the only thing the decorator actually mounts) is invisible in static capture, since every toast story is click-triggered.
- This DS therefore has **no React provider requirement at all**. `cfg.provider` would need a bundle export that accepts children; `ApplicationToaster` does not, so setting it would break previews.

## [GENERAL] CSS comes from the storybook build

`tokens/theme.css` is a **Tailwind v4 source** file (`@import "tailwindcss"`, `@source ...`), not compiled CSS — never set it as `cfg.cssEntry`. The converter's `[CSS_FROM_STORYBOOK]` path scrapes the compiled stylesheet out of `.design-sync/sb-reference` and is the correct route. Consequence: **the reference storybook must be rebuilt whenever DS source or tokens change**, or the shipped CSS goes stale along with the oracle.

## Known warnings — triaged, safe to ignore

- `[TOKENS_MISSING]`: `--tw`, `--toast-index`, `--toast-swipe-movement-x/-y`, `--toast-height`, `--toast-offset-y`. All set at runtime (Tailwind internal + the toast lib's inline styles). Expected absent from static stylesheets.
- `[BUNDLE_EXPORT]` compound namespace `ApplicationToast` — usable via `.Sub`, not a defect.
- esbuild `ignored-bare-import` warnings for `lucide-react` and `@base-ui/react/toggle` — both packages declare `sideEffects: false`; the imports are type/side-effect-free.

## Capture settings

- `--max-stories 13` is used throughout (default cap is 6). Combobox has 13 stories, Button 12, DatePicker 11, Input 10 — all carry genuinely distinct variants worth verifying. **Keep 13 on re-syncs**, and never change it mid-wave.
- Framing convention: the preview panel captures at a fixed viewport (~900x700) while storybook crops to content. Tall stories (e.g. `ApplicationTable` Overview) are cut off on the preview side. This is harness framing, not a fidelity defect — judge content, not canvas size.

## Config decisions made (and why)

- `overrides.ApplicationPagination.cardMode: "column"` — validate flagged `[GRID_OVERFLOW] … wide`
  (Overview renders wider than its grid cell, so the product card cropped it). `column` gives each
  story full card width and keeps them all. Confirmed gone from the final validate.
- `readmeHeader: .design-sync/conventions.md` — see that file. It is human-editable and owned by
  its authors; a future sync should VALIDATE it against the fresh build, not rewrite it.

## Repo-side observations (not sync defects)

- `ApplicationTable` "With Row Selection": the row checkboxes render as **thin vertical bars** in the storybook reference itself. The preview reproduces this faithfully, so the sync is correct — but the same odd rendering will appear in Claude Design. Worth fixing in the repo.

## Patterns and gallery are not synced

`[TITLE_UNMAPPED]` drops 7 titles: `Form`, `EmptyState`, `ErrorState`, `Search`, `DataTable`, `ButtonGroupExample`, `AllComponents` (i.e. all of `stories/patterns/` + `stories/gallery/`). These are **composition patterns, not package exports** — there is no component for `titleMap` to point at, so they cannot ship as components in this shape. Their guidance belongs in `.design-sync/conventions.md` instead.

## First sync result (2026-08-25)

- Project: `Application UI Kit (synced)` — `44a70dfc-0c60-4cf3-8173-eebc0bf9d1b2`.
- 21/21 components graded `match`, 178 stories captured, **zero** mismatches and zero factual
  failures (no `sb-error`, no `unpaired`, no `error` cells, no `[PORTAL?]`).
- Final driver verdict: `ok: true`, all stages green, `pendingGrade: []`, `canary: null`.
- Final render check: 21 total / 0 bad / 0 thin / 0 variants-identical / nothing flagged.
- 122 files uploaded and verified.

## Re-sync risks

- **Rebuild `sb-reference` together with `bun run build`.** Because CSS is scraped from the storybook build, a stale reference silently ships stale styling AND grades against the old design. `[REFERENCE_STALE?]` in the capture log means this was forgotten.
- The "no `cfg.provider`" decision above is a *verified* conclusion, not an oversight. If a future version introduces a real React context provider (theme, i18n, toast context), this decision must be revisited — previews would then render unwrapped and silently wrong.
- Grades were earned with `--max-stories 13`. Lowering it would leave tail stories verified-by-upload without ever having been captured.
- No story loads remote assets, so `[ASSETS_BLOCKED]` is not a risk here today. If stories later add CDN images, grade them only from a shell with egress.
