# ADR-0004: フォーム検証の所有者

**ステータス**: 提案

## コンテキスト

このキットのフォーム部品は、Popover や ToggleGroup を土台にしているため **それ自体がフォームコントロールではありません**。値を通常のフォーム送信へ載せるために、視覚的に隠した `<input>` を併せて描画しています。この input は支援技術から二重に読まれないよう `aria-hidden="true"` かつ `tabIndex={-1}` です。

これは Base UI（v1.7.0）の実装をそのまま踏襲したものです。`radio` / `select` / `combobox` / `checkbox` / `otp-field` / `number-field` のすべてが同じ形で描画します。

```js
// @base-ui/react/radio/root/RadioRoot.js ほか
style: name ? visuallyHiddenInput : visuallyHidden,
'aria-hidden': true,
tabIndex: -1,
required,
```

### 問題

ネイティブのフォーム検証（`<form>` + `required` + 送信）を使うと、ブラウザは「最初の invalid なコントロール」へ**プログラム的にフォーカスします**。その相手がこの `aria-hidden` な input になります。

支援技術から見ると、存在しないことになっている要素へフォーカスが移ります。結果として、

- どの項目が無効なのか分からない
- 検証メッセージも伝わらない
- 可視のトリガーには `aria-invalid` も付かない

送信はブロックされ続けるため、**原因の項目に到達できないまま詰みます。**

このキットでは次の 2 経路が該当します。

| 経路 | 内容 |
|---|---|
| `Patterns/Search` ではなく `Patterns/Form` の推奨形 | 「フォーム全体を `<form>` で包み `type="submit"` を使う」。見本自体が `ApplicationSelect ... required` を含む |
| `ApplicationFormDialog` | `formRef.current.requestSubmit()`。`requestSubmit()` は `submit()` と違い対話的な制約検証を走らせる |

### Base UI 側の設計

Base UI はこの状況を想定していないわけではなく、**別の層で解決する設計**です。

| 層 | 役割 |
|---|---|
| 隠し input | 値の運び手のみ。`aria-hidden` は意図的（二重読み上げの回避） |
| `Field` | 可視コントロールへ `aria-invalid` を付け、`validationMessage` をエラー文言として出す |
| `Form` | `noValidate` を付けてネイティブ検証を止め、**自前で可視コントロールへフォーカスする** |

```js
// @base-ui/react/form/Form.js
props: [{
  noValidate: true,
  onSubmit(event) {
    formRef.current.fields.forEach(field => field.validate());
    if (focusFirstInvalid()) { event.preventDefault(); return; }
```

`focusFirstInvalid()` のコメントは「Keep submission blocked, but move focus to the first invalid field that has a **usable control**」です。`Form` を使っていれば、ブラウザが `aria-hidden` な input をフォーカスすること自体が起きません。

隠し input のスタイルを `name` の有無で切り替えているのも同じ配慮です（`visuallyHiddenInput` は `position: absolute` で、万一ネイティブ検証が使われたときに吹き出しが部品の近くへ出る。upstream issue [#3718](https://github.com/mui/base-ui/issues/3718) の修正）。ネイティブ検証との併用は [#3828](https://github.com/mui/base-ui/issues/3828)（open, `docs`）で「ドキュメントと DX を改善する必要がある領域」として認識されています。

### このキットの現状

- `components/ui/field.tsx` は **Base UI の `Field` ではなく** shadcn の素の markup（`fieldset` / `div` / `label` + `cn-field-*`）
- `ApplicationFormField` は props で受けたエラーを `id` / `aria-describedby` / `aria-invalid` へ結線する**表示部品**
- `Form` 相当は存在しない

つまり **「Base UI から隠し input のパターンだけを受け取り、その前提である `Form` / `Field` 層を持たないまま、ネイティブ検証を推奨している」** 状態です。Base UI の欠陥ではなく、組み合わせの選択の帰結です。

## 決定

**2 段構えにします。**

### 1. 当面（実施済み）

`ApplicationTreeSelect` と `ApplicationButtonGroup` で、送信用 input の `invalid` イベントを横取りします。

```tsx
onInvalid={(event) => {
  event.preventDefault();                                 // ブラウザのフォーカス・吹き出しを止める
  setMessage(event.currentTarget.validationMessage);      // ブラウザのローカライズ済み文言
  visibleControl.focus();                                 // 可視コントロールへ
}}
```

HTML 仕様上、`invalid` をキャンセルするとその要素は "unhandled invalid controls" から外れ、ブラウザによるフォーカスと吹き出しが起きません。**フォームが invalid である事実は変わらないため、送信はブロックされたまま**です。そのうえで可視コントロールに `aria-invalid` とエラー文言を紐づけます。

実装は `components/application/native-validation.tsx` に共有ヘルパとして置きます。

この 2 つを先行させるのは、**このリポジトリが API を設計した部品だから**です。Base UI 由来の 4 部品（Select / Combobox / Checkbox / RadioGroup）には同じ手当てをしていません。それらは 2 の対象です。

### 2. 本筋（未決定・この ADR の論点）

キットの Field / Form 層を Base UI の `Field` / `Form` の上に載せ替え、**検証の所有者を 1 箇所に決めます。**

決める必要があるのは次の点です。

1. `Form` の `noValidate` を受け入れるか。受け入れるとネイティブ検証は全フォームで無効になり、検証タイミングは Base UI の `validationMode`（既定 `onSubmit`）に従う
2. `ApplicationFormField` を Base UI の `Field` ベースへ作り替えるか、現行の表示専用のまま `Field` を併用するか
3. カスタム部品（TreeSelect / ButtonGroup / DatePicker / ScopeSearch）を `Field` のコンテキストへどう登録するか
4. `ApplicationFormDialog` の `requestSubmit()` 経路をどう扱うか
5. テンプレート（`.html`）側の `form-validation.js` との責務境界

## 結果

- 1 により、`ApplicationTreeSelect` / `ApplicationButtonGroup` は「未選択で送信 → 可視コントロールにフォーカスとエラー」が成立する
- 1 は 2 の妨げにならない。2 を採るときに `native-validation.tsx` を削除すれば済む
- 2 を採らない限り、Base UI 由来の 4 部品は「`required` は効くが、無効時のフォーカスが支援技術に伝わらない」まま残る。**これは既知の未解決事項として残す**
- Base UI へは「隠し input へのプログラム的フォーカスが支援技術に伝わらない」旨を報告する余地がある（[#3828](https://github.com/mui/base-ui/issues/3828) に近いが、支援技術の観点は未報告）

## 見直し

2 を決める前に、実アプリでネイティブ検証にどの程度依存しているかを確認します。すべてのフォームが React 側で検証しており、`required` が保険としてしか使われていないなら、`noValidate` の影響は小さく 2 を進めやすくなります。
