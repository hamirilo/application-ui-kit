# Application UI Kit

汎用的なReact UIコンポーネント、セマンティックToken、StorybookによるUI仕様をまとめる公開リポジトリです。

## 役割

- Standard: UIに関する判断原則は ai-dev-standards が所有します。
- Playbook: 実装手順・検証方法・運用のコツは ai-dev-playbook が所有します。
- UI Kit: このリポジトリは、実際に参照・利用する汎用UIとToken、Storybook仕様を所有します。

社員検索、組織ツリー、Authentik連携などの業務ドメインUIは各アプリで管理してください。このリポジトリにはアプリ固有設定、サーバー連携、AI向けルールを置きません。

## Storybook

StorybookをUIの視覚的な仕様・使用例として扱います。新しいUIを作る前に既存のComponentとPatternを確認し、共通化するものにはStoryを追加してください。

    bun install
    bun run storybook

## Token

tokens/theme.css がスタイルTokenの入口です。コンポーネントではraw colorではなく、bg-primary、text-foreground、border-borderなどのsemantic tokenを使います。アプリごとのブランド差分はアプリ側のToken overrideで表現し、コンポーネント実装を複製しないでください。

## Package

既存利用者との互換性を優先し、パッケージ名は当面 @hamirilo/ui を維持します。公開リポジトリ名とnpmパッケージ名の変更は、別の明示的なAPI移行として扱います。

    import { HamiriloButton } from '@hamirilo/ui'
    import '@hamirilo/ui/styles.css'

    <HamiriloButton variant="primary">保存</HamiriloButton>

Hamirilo*という既存のexport名は初回移行では変更していません。名称の一般化は、移行とAPI変更を混ぜないため別PRで検討します。

## 資産を追加するとき

1. 複数アプリで再利用できる汎用UIか確認する。
2. components/hamirilo/に実装し、components/ui/は下請けprimitiveに限定する。
3. Tokenはtokens/theme.cssを更新する。
4. Storybookに目的、状態、使い方、使わない場面を追加する。
5. typecheck、test、lint、Storybook buildを確認する。

実装の詳細な手順や昇格判断はPlaybookを参照してください。

