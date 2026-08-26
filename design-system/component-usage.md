# Component Usage

まず既存部品を使います。必要な状態・props・具体例はStorybookを正とします。

| 目的 | 選ぶ部品・パターン |
| --- | --- |
| 通常操作 | ApplicationButton |
| 削除・危険操作 | dangerのButton + Confirm Dialog |
| 文字・選択入力 | ApplicationInput / ApplicationSelect / ApplicationCombobox |
| 入力ラベル・必須・エラー | ApplicationFormField |
| 一時通知 | ApplicationToast |
| 一覧 | ApplicationTable。空状態を必ず考慮する |
| 画面内の切替 | ApplicationTabs |
| 状態表示 | ApplicationBadge / ApplicationActiveIndicator |
| 日付入力 | ApplicationDatePicker |
| ページ送り | ApplicationPagination |

- shadcn/uiに相当物があり、追加の価値がない場合は新しいApplicationラッパーを作らない。
- primaryは主操作、secondaryはキャンセル・戻る、dangerは削除に使う。
- Reactでは既存のReactコンポーネントを使う。テンプレート用CSSクラスやraw utilityの組み合わせで同じ部品を再実装しない。
- 業務ドメイン固有の部品（社員選択、組織ツリーなど）は、このUI Kitではなく所有アプリに置く。
