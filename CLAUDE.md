# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **共通ルール**: このプロジェクトは開発Standard（`ai-dev-standards`）に準拠する。
> AI エージェントは最初に `../ai-dev-standards/ai/ONBOARDING.md` を読むこと
> （sibling checkout がない場合は https://github.com/hamirilo/ai-dev-standards/blob/main/ai/ONBOARDING.md ）。
> ここには **このプロジェクト固有の差分だけ** を書く。

## プロジェクト概要

汎用的な React UI コンポーネント、セマンティック Token、Storybook による UI 仕様、
および Claude Design / 人間向けの設計参照（`design-system/`）をまとめる公開リポジトリ。
Django + htmx との汎用的な接続（Islands）は `./islands` エントリで提供する
（[decisions/adr-0001](decisions/adr-0001-django-htmx-islands.md)）。

実装前に [decisions/project-context.md](decisions/project-context.md) を読むこと。

## このリポジトリ固有のルール

- **ラップは「足せる value があるとき」だけ。** shadcn/ui に相当物があり value を
  足せないなら、`components/application/index.ts` から re-export するだけにする。
- **見た目は `tokens/components.css` の cn-\* クラスに置き、`.tsx` にクラスを直書きしない。**
  Token（`bg-primary` / `text-foreground` 等）以外の raw color を追加しない。
- **業務ドメイン固有の UI（`UserPicker` / `DepartmentPicker` 等）は置かない。**
  そのドメインを所有するプロジェクトに置く。
- 新しい UI を作る前に Storybook で既存の Component / Pattern を確認する。
  共通化するものには Story を追加する（Overview を先頭に）。
- 必須ゲート: `bun run typecheck` / `bun run test` / `bun run lint` / `bun run build` /
  `bun run build-storybook` を通すこと。

判断基準の正は [Application UI Standard](../ai-dev-standards/standards/application-ui/README.md) §1 / §6。
追加・削除の手順と詳細は [README.md](README.md) を参照。
