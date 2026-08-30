# UI Platform

このリポジトリは、社内アプリケーション向けの **UI設計とUI実装の統合入口** として扱います。

従来の Application UI Kit（再利用可能なコンポーネント）を中核に残しつつ、UI設計時に参照する Pattern、画面レベルの Template、そしてそれらを見て比較する Catalog を同じ場所で管理します。

## 役割

| 領域 | 問い | 内容 |
| --- | --- | --- |
| Foundations | どんな見た目の基盤を使う？ | Semantic Token、Typography、Spacing など |
| Components | 使える部品は？ | 実際にアプリから import する再利用可能なUI |
| Patterns | どういうUI設計を選ぶ？ | 同じUX課題に対する複数の良い解決パターン |
| Templates | 画面全体をどう組み立てる？ | 一覧、詳細、CRUD、設定画面などの構成例 |
| Catalog | 実物を見て比較したい | Storybook。Components / Patterns / Templates の表示・検証面 |

## AI Dev Platformとの境界

- `ai-dev-standards`: UIを含む開発上の原則・制約
- `ai-dev-playbook`: 実装手順、検証、トラブルシュート
- `ai-dev-platform`: Standards / Playbook / Recommendations への統合入口
- **UI Platform（このリポジトリ）**: UIの設計候補、画面例、実装部品、視覚的Catalog

たとえば「単一選択をどう見せるか」は UI Pattern、「どのフォームライブラリを標準候補にするか」は Recommendation、「DjangoとReactをどう接続するか」は Playbook の責務です。

## Packageとの関係

このリポジトリ全体を UI Platform として扱いますが、アプリケーションが依存する公開パッケージは当面 `@hamirilo/application-ui-kit` のまま維持します。

リポジトリの役割変更とパッケージAPIの変更を分離し、既存利用側へ不要な破壊的変更を発生させないためです。

```text
UI Platform repository
├── components/       packageとして配布するUI
├── tokens/           packageとして配布するToken
├── patterns/         設計判断用のPattern定義
├── templates/        画面構成例の定義
└── stories/          Storybook Catalogの実体
```

## Patternの考え方

Patternは「コンポーネントの説明」ではなく、**実際の設計上の問題をどう解くか**を単位にします。

たとえば `single-choice` は Radio / Select / Combobox / Button Group などを個別Patternに分けず、「ユーザーに1つ選ばせる」という問題の中で比較します。

Patternを追加する目安は次の1点です。

> 実際の開発で一度迷い、次回も同じ判断に迷いそうか。

一般的に存在するUIパターンを網羅するためだけには追加しません。

## Catalog

Catalogは新しい知識レイヤーではなく、Components / Patterns / Templates を人間とAIが確認するための表示面です。

既存のStorybookをCatalogとして利用します。

```bash
bun install
bun run storybook
```

Storybookで、部品単体だけでなく「複数候補を横並びで比較できるPattern」を優先して整備します。

## PatternからComponentへの昇格

Patternで使った組み合わせをすぐ共通Componentにしません。

```text
Patternとして試す
  ↓
複数の実案件で採用する
  ↓
実装もほぼ同じ形で繰り返される
  ↓
Component化を検討する
```

これにより、UI Platform自体が過剰な抽象化や大量の専用Componentで肥大化することを防ぎます。
