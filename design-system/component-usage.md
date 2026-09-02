# Component Usage

まず既存部品を使います。必要な状態・props・具体例はStorybookを正とします。

| 目的 | 選ぶ部品・パターン |
| --- | --- |
| 通常操作 | ApplicationButton |
| 削除・危険操作 | dangerのButton + Confirm Dialog |
| 文字・選択入力 | ApplicationInput / ApplicationSelect / ApplicationCombobox |
| 入力ラベル・必須・エラー | 単一のコントロール: ApplicationFormField / グループ（ラジオ・ボタングループ）: ApplicationFieldSet |
| 一時通知 | ApplicationToast |
| 一覧 | ApplicationTable。空状態を必ず考慮する |
| 画面横断の検索（人も組織も探す） | ApplicationScopeSearch。候補は props で渡す |
| 候補を見比べて1つ選ぶ | 説明で足りる: ApplicationRadioGroup `variant="cards"` / 列で比較する: ApplicationRadioTable |
| 画面内の切替 | ApplicationTabs |
| 状態表示 | ApplicationBadge / ApplicationActiveIndicator |
| 日付入力 | ApplicationDatePicker |
| ページ送り | ApplicationPagination |
| 値のコピー | ApplicationCopyButton（テンプレートなら Islands の copy-field）。ワンタイム URL 等は値が見える入力欄と組にする |
| 種類をまたぐ横断検索 | ApplicationScopeSearch。1 種類だけの絞り込みは ApplicationSearchInput |

- エラーは2本立てで伝える。**Fieldに`data-invalid`（見た目）とコントロールに`aria-invalid`（支援技術）**。片方だけでは伝わらない。
- shadcn/uiに相当物があり、追加の価値がない場合は新しいApplicationラッパーを作らない。
- primaryは主操作、secondaryはキャンセル・戻る、dangerは削除に使う。
- Reactでは既存のReactコンポーネントを使う。テンプレート用CSSクラスやraw utilityの組み合わせで同じ部品を再実装しない。
- 業務ドメイン固有の部品（社員選択、組織ツリーなど）は、このUI Kitではなく所有アプリに置く。

## 忘れても失敗しないが、動かない2点

エラーにならず、症状だけが出ます。

- **Toastは `<ApplicationToaster />` をアプリのルートに1つ置く。** 無くても
  `ApplicationToast.success(...)` の呼び出しは成功し、何も表示されないだけになる。
- **ダークモードはpropでもmedia queryでもなく、`<html>` の `dark` クラス。**
  ライトが既定で、何も要らない。切替UIが必要なら `ApplicationThemeToggle` を使う。
