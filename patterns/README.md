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

必要最小限として、次を記録します。

1. **Problem** — 何を解決するPatternか
2. **Options** — 有力な選択肢
3. **Choose when** — どんな条件なら選ぶか
4. **Avoid when** — どんな条件では避けるか
5. **Examples** — 実際に動くStorybook Story

Patternはルールではありません。プロジェクトの条件に合わせて最適な候補を選びます。

## 追加基準

次の問いにYesなら追加候補です。

> 実際の開発で一度迷い、次回も同じ判断に迷いそうか。

「一般的に有名だから」「網羅したいから」だけでは追加しません。

## Catalogとの関係

このディレクトリはPatternの意味・判断軸を持ちます。実際の見た目と操作例は `stories/patterns/` に置き、StorybookをCatalogとして利用します。

## 最初のPattern

- [Single Choice](single-choice.md)
