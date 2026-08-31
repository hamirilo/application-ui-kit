# UI Patterns

UI Patternは、コンポーネントそのものではなく **繰り返し発生するUI/UX上の問題と、その解決候補** を記録します。

## Patternの単位

良い例:

- single-choice: 1つ選ばせる
- data-list: 複数件を一覧表示する
- search-and-filter: 検索・絞り込みを行う
- destructive-action: 破壊的操作を安全に実行する

細かすぎる例:

- radio
- select
- combobox

Radio / Select / Combobox は `single-choice` という1つの問題に対する解決候補です。

## 各Patternに残す情報

次の5つの見出しをこの順で置きます。

1. **Problem** — 何を解決するPatternか。なぜ1つのComponentに固定できないか
2. **Options** — 有力な選択肢の表。列は `Option` / `Choose when` / `Avoid when`
3. **Selection guide** — 上から順に答えると候補が絞れる分岐（```text のブロック）
4. **Notes** — 選んだあとに踏みやすい落とし穴。アンチパターンと例外
5. **Catalog** — 対応するStorybook Storyへの参照

Patternはルールではありません。プロジェクトの条件に合わせて最適な候補を選びます。

「Choose when」「Avoid when」はOptionsの表の列として書き、独立した見出しにはしません。
選択肢ごとに条件が並んだほうが比較しやすいためです。

## 追加基準

次の問いにYesなら追加候補です。

> 実際の開発で一度迷い、次回も同じ判断に迷いそうか。

「一般的に有名だから」「網羅したいから」だけでは追加しません。

## Catalogとの関係

このディレクトリはPatternの意味・判断軸を持ちます。実際の見た目と操作例は `stories/patterns/` に置き、StorybookをCatalogとして利用します。

## 一覧

| Pattern | 解決する問題 | Storybook |
|---|---|---|
| [Single Choice](single-choice.md) | 候補から1つ選ばせる | `Patterns/Single Choice` |
| [Data List](data-list.md) | 複数件を一覧で見せ、目的の1件へ到達させる | `Patterns/DataTable` |
| [Search and Filter](search-and-filter.md) | 一覧を絞り込み、空振りしても立て直せるようにする | `Patterns/Search` |
| [Empty State](empty-state.md) | 0件のときに行き止まりを作らない | `Patterns/EmptyState` |
| [Error State](error-state.md) | 失敗をどこまでの範囲で見せ、次の行動を選ばせるか | `Patterns/ErrorState` |
| [Form Layout](form-layout.md) | 入力画面の骨格を固定する | `Patterns/Form` |

Storybookの `Patterns/ButtonGroupExample` は独立したPatternにしていません。
Button Groupは「1つ選ばせる」問題の解決候補の1つなので、
[Single Choice](single-choice.md) の中で比較します。
