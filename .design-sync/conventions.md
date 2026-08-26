## How to build with this kit

A dense, quiet, light-first **Japanese business-application** kit: white surfaces, hairline
grey rules, one blue that means "actionable", 8px radii, one shallow shadow, no decoration
that carries no information.

### Setup

Mount `<ApplicationToaster>` once near the app root. **It provides the toast manager only —
it is not a theme or i18n provider.** Nothing else needs a wrapper; components read their
design from CSS custom properties, so they are styled as soon as `styles.css` is loaded.

```jsx
const { ApplicationToaster, ApplicationButton, ApplicationToast } = window.HamiriloApplicationUiKit;
<ApplicationToaster>
  <main className="bg-background p-6 text-foreground">{/* screens */}</main>
</ApplicationToaster>
```

**Dark mode is class opt-in:** put `class="dark"` on `<html>`. There is no
`prefers-color-scheme` rule anywhere — never rely on the OS setting. Surfaces and borders
change in dark; the primary / success / danger / warning / info hues do not.

### Styling idiom — semantic Tailwind utilities

Tailwind v4 utilities bound to semantic tokens. **Never write a raw color** (`bg-white`,
`text-gray-900`): it is a lint error in this repo and it is exactly what breaks dark mode.

| Purpose | Utilities |
|---|---|
| Surfaces | `bg-background`, `bg-card`, `bg-popover`, `bg-muted`, `bg-accent` |
| Text | `text-foreground`, `text-muted-foreground`, `text-primary`, `text-danger` |
| Actions | `bg-primary`, `bg-success`, `bg-danger` |
| Lines | `border-border` |
| Type | `font-sans` (Inter + IBM Plex Sans JP) |

Underlying tokens, if you need `var()`: `--color-primary`, `--color-card`, `--color-border`,
`--color-muted-foreground`, `--radius`, `--font-sans`.

**The shipped stylesheet is a JIT subset.** `_ds_bundle.css` contains only the Tailwind
utilities this kit and its stories actually use — it is not the full Tailwind surface. Common
ones resolve (`flex`, `grid`, `gap-*`, `p-*`, `space-y-1..4`, `grid-cols-1..6`, `text-*`,
`rounded-lg/xl`, `max-w-*`), but plenty do not (`min-h-screen`, `space-y-6`, `m-0`). Before
relying on a utility, grep for it in the stylesheet; if it is missing, use an inline
`style` with the tokens instead (`style={{ minHeight: "100vh" }}`) rather than shipping a
class that silently does nothing.

Two vocabularies exist that you should **not** author:
- `cn-*` classes are the kit's own component skins. Read them, never write new ones.
- `.btn-primary`, `.btn-secondary`, `.input-field`, `.card`, `.badge`, `.data-table` are for
  **server-rendered HTML** (Django templates), deliberately pixel-matched to the React
  components. In React, use the components instead.

### Rules that are not negotiable here

- **Every control is on the 24 / 28 / 32 / 40px height scale** (`size="xs" | "sm" | default | "lg"`).
  Buttons and inputs share it, so filter rows line up. 32px is the working default.
- **One primary action per screen.** Cancel is always `secondary`; delete is always `danger`.
- **UI text is Japanese**; code, props, tokens and class names are English. Put a space
  between Japanese and Latin/digits (`全 24 件`), and group digits (`78,000 円`).
- **Always show counts** (`全 24 件`, `3 件を選択中`). A list with no row count is not trusted.
- **Confirm buttons name the act**, not OK: 「削除」「承認」「3 件を削除」.
- **Distinguish the two empty states.** Nothing exists yet → 「申請がありません」 +
  「「新規申請」から作成してください」. Filtered to zero → 「条件に一致する申請がありません」 +
  「検索条件を変えてお試しください」. Using one wording for both is a bug.
- **Toasts carry results only** (「保存しました」). Never validation errors — use the field's error.
- Status uses `ApplicationBadge tone=` — `new` `active` `done` `warning` `danger` `pending`
  `neutral`. The label must state the status in words; the tint alone is not AA.
- Cards never nest. Split long forms into sibling cards, each with a title.
- Shadows: `shadow-sm` for in-flow surfaces, `shadow-lg` for overlays. Nothing between.
- No emoji anywhere — not in UI copy, not in source.

### Where the truth lives

Read `_ds/<folder>/styles.css` and everything it `@import`s (`tokens/*`, `_ds_bundle.css`)
before styling — that is the real palette, type scale and component skin. Each component has
a `.prompt.md` next to it with its API notes, and `guidelines/` holds the kit's own design
reference documents.

### An idiomatic screen fragment

```jsx
const { ApplicationTable, ApplicationBadge, ApplicationButton, ApplicationSearchInput } = window.HamiriloApplicationUiKit;

<section className="space-y-3">
  <div className="flex items-center justify-between gap-3">
    <ApplicationSearchInput placeholder="件名で検索" />
    <ApplicationButton>新規申請</ApplicationButton>
  </div>
  <p className="text-xs text-muted-foreground">全 24 件</p>
  <ApplicationTable
    columns={[
      { key: "code", header: "申請番号", cell: (r) => r.code },
      { key: "status", header: "ステータス",
        cell: (r) => <ApplicationBadge tone={r.tone}>{r.label}</ApplicationBadge> },
    ]}
    rows={rows}
    rowKey={(r) => r.id}
  />
</section>
```
