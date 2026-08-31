# UI Platform

このリポジトリは、社内Application向けの **UI設計とUI実装の統合入口** です。

UIの具体的なFoundations、Components、Patterns、Templates、Catalogを同じ場所で管理し、Application UI Standardが定める制約を実際のdesignと実装へ落とし込みます。

## 役割

| 領域 | 問い | 内容 |
|---|---|---|
| Foundations | どんな見た目の基盤を使う？ | Semantic Token、Typography、Spacing等 |
| Components | 使える部品は？ | Applicationからimportする再利用可能UI |
| Patterns | どういうUI設計を選ぶ？ | UX課題に対する有力な解決候補と選択条件 |
| Templates | 画面全体をどう組み立てる？ | 複数Pattern / Componentを組み合わせた構成例 |
| Catalog | 実物を見て比較・検証したい | Storybook |
| Design reference | AI / 人間へ何を渡す？ | `design-system/` の自己完結した設計参照 |

## AI Dev Platformとの境界

- `ai-dev-platform`: Applicationから見た統合入口、Recommendations、Standards / Playbookのversion組合せ
- `ai-dev-standards`: UIを含む開発上の技術選定・責務境界・守る制約
- `ai-dev-playbook`: 実装・移行・検証・troubleshootingの手順
- **UI Platform**: UIの具体的な設計候補、画面例、実装部品、視覚的Catalog

UI PlatformへStandard本文や一般的な実装Playbookを複製しません。

## Packageとの関係

リポジトリ名は `ui-platform`、Applicationから利用するpackage依存名は `application-ui-kit` とします。

GitHub Packages上の実package名は `@<owner>/application-ui-kit` です。利用側はnpm aliasを使い、Application codeではownerに依存しない固定名でimportします。

```text
UI Platform repository
├── components/       packageとして配布するUI
├── tokens/           packageとして配布するToken
├── patterns/         設計判断用のPattern
├── templates/        画面構成例
├── stories/          Storybook Catalog
└── design-system/    AI / 人間向け設計参照
```

## Component / Pattern / Templateの境界

### Component

複数Applicationから再利用する実装部品です。既存のshadcn/uiを名前だけ変えてwrapせず、追加できるvalueがある場合だけ独自APIを作ります。

### Pattern

Component名ではなく **設計上の問題** を単位にします。

例: `single-choice` ではRadio / Select / Combobox / Button Groupを別々のPatternにせず、「1つ選ばせる」という問題の中で比較します。

追加基準は次の1点です。

> 実際の開発で一度迷い、次回も同じ判断に迷いそうか。

### Template

複数Pattern / Componentを組み合わせた画面levelの構成例です。Application固有API、権限、業務ruleを持ち込みません。

## Catalog

StorybookはComponents / Patterns / Templatesを人間とAIが確認する表示・比較・検証面です。Catalog自体を別の知識layerとして増やしません。

```bash
bun install
bun run storybook
```

## 共通化の成熟

```text
Projectで実装する
  ↓
Patternとして比較・再利用する
  ↓
複数Applicationで同じ実装が繰り返される
  ↓
Component化を検討する
```

1つ目の利用だけで先行抽象化しません。
