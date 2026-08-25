## How to build with this kit

`@hamirilo/application-ui-kit` — 21 React components for Japanese-language business
applications (Django + React Islands). Content in examples is Japanese; keep it that way
unless asked otherwise.

### Setup — no React provider needed

There is **no ThemeProvider, no context wrapper**. Link the stylesheet and mount:

```jsx
const { ApplicationButton, ApplicationToaster } = window.HamiriloApplicationUiKit;

<div>
  <ApplicationButton variant="primary">保存</ApplicationButton>
  <ApplicationToaster />   {/* mount ONCE per app root — see below */}
</div>
```

Two setup rules that fail silently when missed:

- **Toasts need `<ApplicationToaster />` mounted once** at the app root. `ApplicationToast`
  triggers render fine without it and simply never show a toast.
- **Dark mode is a class, not a prop or a media query**: put `class="dark"` on `<html>`
  (`@custom-variant dark (&:where(.dark, .dark *))`). Light is the default and needs nothing.

### Styling idiom — Tailwind v4 utilities over semantic tokens

Style with utility classes; the palette is semantic, never raw colors. Use
`bg-primary` / `text-danger`, never `bg-blue-600` / `text-red-500` — the meaning is the token.

| Family | Ships |
|---|---|
| Surface / text | `bg-background` `bg-card` `bg-popover` `bg-muted` `bg-accent` `text-foreground` `text-muted-foreground` `text-popover-foreground` |
| Intent | `bg-primary` `bg-secondary` `bg-success` `bg-danger` `bg-warning` `bg-info` · `text-primary` `text-success` `text-danger` `text-destructive` |
| Border | `border-border` `border-input` `border-danger` `border-primary/20` |
| Spacing | `gap-1 1.5 2 2.5 3 4 6 8` · `p-0 2 3 4 6` · `px-1.5 2 2.5 3 3.5 4 8` · `py-0.5 2 2.5 3 4 10 12` · `space-y-1 1.5 2 2.5 3 4 8` |
| Type | `text-xs sm base lg xl 2xl 3xl` · `font-sans` (Inter + IBM Plex Sans JP) |
| Radius / shadow | `rounded-md lg xl 2xl full` · `shadow-sm md lg xl 2xl` |

**The one thing that will bite you: `_ds_bundle.css` is a JIT-compiled Tailwind sheet.**
It contains only the ~853 classes this kit actually uses. Utilities that were never used
are **not in the file and do nothing** — verified absent: `gap-5`, `gap-7`, `mt-11`,
`w-1/3`, `grid-cols-7`, `text-red-500`. Stay inside the families above; for anything else
use an inline `style` or a `var(--color-*)` value rather than inventing a class.

Two class families you must **not** author:

- `cn-*` (193 classes: `cn-button`, `cn-checkbox`, …) — internal skins for the kit's own
  `components/ui/*` internals. Never write them.
- `btn-primary`, `btn-secondary`, `btn-danger`, `btn-success`, `btn-sm/lg/xs`, `card`,
  `badge`, `avatar-sm/md/lg` — these are for **Django templates (`.html`)**, not React.
  In React, use `<ApplicationButton variant="primary">`, not `class="btn-primary"`.

### Where the truth lives

- `_ds/<folder>/styles.css` → `@import`s `fonts/fonts.css` + `_ds_bundle.css`. Grep
  `_ds_bundle.css` to confirm a class exists before relying on it.
- `components/components/<Name>/<Name>.prompt.md` — real props (documented in Japanese)
  plus real story JSX per component. Read this before using a component.

### Idiomatic example

```jsx
const { ApplicationButton, ApplicationTable, ApplicationBadge } = window.HamiriloApplicationUiKit;

<div className="space-y-4 p-6 bg-background">
  <div className="flex gap-2">
    <ApplicationButton variant="primary">新規</ApplicationButton>
    <ApplicationButton variant="secondary" size="sm">CSV 出力</ApplicationButton>
  </div>
  <p className="text-sm text-muted-foreground">対象は 4 件です。</p>
</div>
```

Semantics the kit assumes: `primary` is the single main action per screen, `secondary` is
cancel/back, `danger` is delete, `success` is approve. `loading` implies `disabled`.
