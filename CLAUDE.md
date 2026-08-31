# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **共通入口**: AI エージェントは最初に `../ai-dev-platform/ai/ONBOARDING.md` を読むこと。
> sibling checkout がない場合は https://github.com/hamirilo/ai-dev-platform/blob/main/ai/ONBOARDING.md を参照する。
> Standards / Recommendations / Playbook の選択は ai-dev-platform のルーティングに従い、ここには **このプロジェクト固有の差分だけ** を書く。

## プロジェクト概要

社内アプリケーション向けの **UI Platform**。

汎用的な React UI コンポーネントと Semantic Token に加え、UI設計時に比較する Pattern、
画面レベルの Template、Storybook による Catalog、Claude Design / 人間向けの設計参照
（`design-system/`）を同じ入口から提供する。

アプリケーションが依存する公開パッケージは当面 `application-ui-kit` のまま維持し、
リポジトリ全体の役割変更と package API のversioningを分離する。
scope は publish 時にリポジトリ所有者から導出されるため、ドキュメント中は
`@<owner>/application-ui-kit` と表記する。詳細は README「Package」。

Django + htmx との汎用的な接続（Islands）は `./islands` エントリで提供する
（[decisions/adr-0001](decisions/adr-0001-django-htmx-islands.md)）。

実装前に [decisions/project-context.md](decisions/project-context.md) と [UI_PLATFORM.md](UI_PLATFORM.md) を読むこと。

## このリポジトリ固有のルール

- **Component** は実際に複数Applicationから再利用する実装部品。Patternで使った組み合わせをすぐComponent化しない。
- **Pattern** はComponent名ではなく設計上の問題を単位にする（例: `single-choice`）。複数の有力な解決候補と選択条件を残す。
- **Template** は複数のPattern / Componentを組み合わせた画面レベルの構成例。アプリ固有API・権限・業務ルールを持ち込まない。
- **Catalog** は新しい知識レイヤーではなくStorybookを使った表示・比較・検証面として扱う。
- **ラップは「足せる value があるとき」だけ。** shadcn/ui に相当物があり value を
  足せないなら、`components/application/index.ts` から re-export するだけにする。
- **見た目は `tokens/components.css` の cn-* クラスとSemantic Tokenを基本にする。**
  raw color を追加しない。Pattern / TemplateのStoryでも `text-foreground` 等のSemantic Tokenを使う。
- **業務ドメイン固有の UI（`UserPicker` / `DepartmentPicker` 等）は置かない。**
  そのドメインを所有するプロジェクトに置く。
- 新しい UI を作る前に Storybook で既存の Component / Pattern / Template を確認する。
- Patternの追加基準は「実際の開発で一度迷い、次回も同じ判断に迷いそうか」。網羅性のためだけに増やさない。
- 共通化するComponentには Story を追加する（Overview を先頭に）。Patternは比較できるCatalog Storyを優先する。
- 必須ゲート: `bun run typecheck` / `bun run test` / `bun run lint` / `bun run build` /
  `bun run build-storybook` を通すこと。

判断基準の正は [Application UI Standard](https://github.com/hamirilo/ai-dev-standards/blob/main/standards/application-ui/README.md) §1 / §6。
UI Platform内の責務分担は [UI_PLATFORM.md](UI_PLATFORM.md)、追加・削除の詳細は [README.md](README.md) を参照。
