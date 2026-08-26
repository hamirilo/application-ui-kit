## このキットでの作り方

日本語の社内業務アプリ向けの、密度が高く静かでライト優先のキット。白いサーフェス、
髪の毛のように細いグレーの線、「操作できる」を意味する 1 色の青、8px の角丸、
浅い影が 1 種類だけ、そして情報を運ばない装飾は無し。

### ファイルの置き場所

- `_ds_bundle.js` — 全コンポーネントを含むバンドル（プロジェクト直下）。
  `window.JazmfDxApplicationUiKit` に載る。1 行目は `/* @ds-bundle: … */` のメタデータ。
- `styles.css` — スタイルの唯一の入口。トークン・フォント・コンポーネントスタイル
  （`_ds_bundle.css`）を `@import` している。**リンクするのはこの 1 ファイルだけ。**
- `components/<group>/<Name>/` — `<Name>.prompt.md`（使い方と実例）、
  `<Name>.d.ts`（型）、`<Name>.html`（バリアント一覧）。
- `fonts/` — `@font-face` と woff2 のファイル。
- `guidelines/` — このキット自身の設計参照ドキュメント。大きなレイアウトを組む前に読む。

特定のコンポーネントを見るときは
`read_file("components/<group>/<Name>/<Name>.prompt.md")`。

> 補足: この下の英語の生成部には `tokens/*.css` という項目があるが、
> **このキットには存在しない**（`tokens/` は空）。トークンは `_ds_bundle.css` の中に
> 宣言されている。同じ生成部の Tokens 節にはそう書いてあり、項目のほうが誤り。

### 読み込み

ページに次の 2 行を 1 度だけ加える（React が先に載っていること）:

```html
<link rel="stylesheet" href="styles.css">
<script src="_ds_bundle.js"></script>
```

以降、コンポーネントは `window.JazmfDxApplicationUiKit.*` から使える。ホストページ自身の
React ルートではなく専用の子ノード（例 `<div id="ds-root">`）にマウントし、2 つのツリーが
衝突しないようにする。

### セットアップ

`<ApplicationToaster>` をアプリのルート付近に 1 つだけマウントする。
**これが提供するのはトーストマネージャだけで、theme や i18n の Provider ではない。**
それ以外にラッパーは要らない。コンポーネントは CSS カスタムプロパティから
デザインを読むため、`styles.css` を読み込んだ時点でスタイルが当たる。

```jsx
const { ApplicationToaster, ApplicationButton, ApplicationToast } = window.JazmfDxApplicationUiKit;
<ApplicationToaster>
  <main className="bg-background p-6 text-foreground">{/* 画面 */}</main>
</ApplicationToaster>
```

**ダークモードはクラスによるオプトイン。** `<html>` に `class="dark"` を付ける。
`prefers-color-scheme` のルールはどこにも無いので、OS の設定に頼ってはいけない。
ダークで変わるのはサーフェスと線だけで、primary / success / danger / warning / info
の色相は変わらない。

### スタイルの流儀 — セマンティックな Tailwind ユーティリティ

セマンティックトークンに紐づいた Tailwind v4 のユーティリティを使う。
**生の色を書いてはいけない**（`bg-white`、`text-gray-900`）。このリポジトリでは
lint エラーであり、ダークモードが壊れる原因そのもの。

| 用途 | ユーティリティ |
|---|---|
| サーフェス | `bg-background`, `bg-card`, `bg-popover`, `bg-muted`, `bg-accent` |
| 文字 | `text-foreground`, `text-muted-foreground`, `text-primary`, `text-danger` |
| アクション | `bg-primary`, `bg-success`, `bg-danger` |
| 線 | `border-border` |
| 書体 | `font-sans`（Inter + IBM Plex Sans JP） |

`var()` で直接参照する場合のトークン: `--color-primary`, `--color-card`,
`--color-border`, `--color-muted-foreground`, `--radius`, `--font-sans`。

**同梱のスタイルシートはコンパイル済みのサブセット。** `_ds_bundle.css` は
このキットとその Story に対して Tailwind をコンパイルした結果であり、Tailwind の
全ユーティリティではない。通常のレイアウト・余白・書体・色のユーティリティは
揃っているが、珍しいものは無いことがある。確認は安いので、頼る前にスタイルシートを
grep すること。本当に無ければ、黙って効かないクラスを出荷するのではなく
トークンを使ったインライン `style` にする（`style={{ minHeight: "100vh" }}`）。

**自分で書いてはいけない語彙が 2 つある。**
- `cn-*` クラスはキット自身のコンポーネント外装。読むのは良いが、新しく書かない。
- `.btn-primary`, `.btn-secondary`, `.input-field`, `.card`, `.badge`, `.data-table` は
  **サーバーレンダリングの HTML（Django テンプレート）用**で、React コンポーネントと
  意図的にピクセル単位で一致させてある。React ではコンポーネントを使う。

### ここで譲れないルール

- **コントロールはすべて 24 / 28 / 32 / 40px の高さスケールに乗る**
  （`size="xs" | "sm" | 既定 | "lg"`）。ボタンと入力欄が同じスケールを共有するため、
  絞り込み行に段差ができない。実務上の既定は 32px。
- **1 画面にプライマリのアクションは 1 つだけ。** キャンセルは常に `secondary`、
  削除は常に `danger`。
- **UI の文言は日本語**、コード・プロパティ名・トークン名・クラス名は英語。
  和文と欧文・数字の間には半角スペースを入れ（`全 24 件`）、数値は桁区切りを入れる
  （`78,000 円`）。
- **件数は必ず表示する**（`全 24 件`、`3 件を選択中`）。行数を示さない一覧は信用されない。
- **確認ボタンのラベルは OK ではなく行為を名指しする**: 「削除」「承認」「3 件を削除」。
- **2 つの空状態を書き分ける。** そもそも 1 件も無い →「申請がありません」＋
  「「新規申請」から作成してください」。絞り込みの結果 0 件 →
  「条件に一致する申請がありません」＋「検索条件を変えてお試しください」。
  同じ文言で書くのはバグ。
- **トーストは結果のみ**（「保存しました」）。検証エラーは絶対に載せない。
  該当項目のエラー表示を使う。
- ステータスは `ApplicationBadge tone=` を使う — `new` `active` `done` `warning`
  `danger` `pending` `neutral`。ラベルが状態を言葉で示すこと。淡い色だけでは AA を満たさない。
- カードは入れ子にしない。長いフォームはタイトルを付けた兄弟カードに分ける。
- 影は通常の流れに乗る面に `shadow-sm`、オーバーレイに `shadow-lg`。中間は使わない。
- **絵文字はどこにも使わない** — UI 文言にも、ソースにも。

### 正がどこにあるか

スタイルを当てる前に `_ds/<folder>/styles.css` と、そこから `@import` されるもの
（`tokens/*`、`_ds_bundle.css`）を読むこと。それが実際のパレット・書体スケール・
コンポーネント外装の正。各コンポーネントの隣に API メモの `.prompt.md` があり、
`guidelines/` にはキット自身の設計参照ドキュメントが入っている。

### 画面の断片（この流儀の例）

```jsx
const { ApplicationTable, ApplicationBadge, ApplicationButton, ApplicationSearchInput } = window.JazmfDxApplicationUiKit;

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

> 補足: この文書より下の英語の自動生成部分に
> 「most components read theme/i18n from context」という記述があるが、これは不正確。
> `ApplicationToaster` が持つのはトーストマネージャだけで、テーマは上記のとおり
> `<html class="dark">` で切り替える。
