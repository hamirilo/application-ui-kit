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

## 品質確認（推奨）

このリポジトリでは、アプリ全体の性能スコアを保証するのではなく、コンポーネントとStory単位の品質を確認します。アプリ全体のLighthouseや主要導線の確認は、[品質確認プレイブック](https://github.com/hamirilo/ai-dev-playbook/blob/main/playbooks/quality-checks.md)に従って利用側アプリで実施してください。

新しいコンポーネントやStoryを追加・変更するときは、該当する範囲で次を確認します。

- Storybookのa11yチェックで重大な問題がない
- キーボード操作、フォーカス、ラベル、エラー表示が成立する
- loading、empty、error、disabled、長い文字列などの状態が成立する
- 狭い画面幅でも主要操作と内容が失われない
- reduced motionなど、利用者の設定を不必要に無視しない
- raw colorを追加せず、semantic tokenを利用する
- typecheck、test、lint、Storybook buildが通る

Lighthouseの点数だけを上げるために、意味のあるHTML、アクセシビリティ情報、必要なUI状態を削らないでください。

## Package

パッケージ名は @hamirilo/application-ui-kit です。公開リポジトリ名とパッケージ名を一致させ、初回公開版からこの名前を正式なAPIとして扱います。

    import { ApplicationButton } from '@hamirilo/application-ui-kit'
    import '@hamirilo/application-ui-kit/styles.css'

    <ApplicationButton variant="primary">保存</ApplicationButton>

Application*という名前を公開APIとして採用しています。旧名称の互換exportは提供しません。

## 資産を追加するとき

1. 複数アプリで再利用できる汎用UIか確認する。
2. components/application/に実装し、components/ui/は下請けprimitiveに限定する。
3. Tokenはtokens/theme.cssを更新する。
4. Storybookに目的、状態、使い方、使わない場面を追加する。
5. typecheck、test、lint、Storybook buildを確認する。

実装の詳細な手順や昇格判断はPlaybookを参照してください。

