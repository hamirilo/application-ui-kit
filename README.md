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
- ReactコンポーネントはTSX、補助ロジックはTSを基本とし、理由なくJSXやJavaScriptへ戻さない
- anyで型エラーを隠さず、外部データは必要に応じて実行時検証する
- typecheck、test、lint、Storybook buildが通る

Lighthouseの点数だけを上げるために、意味のあるHTML、アクセシビリティ情報、必要なUI状態を削らないでください。

## Package

パッケージ名は @hamirilo/application-ui-kit です。公開リポジトリ名とパッケージ名を一致させ、初回公開版からこの名前を正式なAPIとして扱います。

    import { ApplicationButton } from '@hamirilo/application-ui-kit'
    import '@hamirilo/application-ui-kit/styles.css'

    <ApplicationButton variant="primary">保存</ApplicationButton>

Application*という名前を公開APIとして採用しています。旧名称の互換exportは提供しません。

### 配布物

`bun run build` が dist/ を作ります。JS は vite の library build、型定義は tsc が出力します。

    dist/index.js                                     ES module 本体
    dist/types/components/application/index.d.ts      型定義

利用側は dist だけをimportします。TypeScriptのビルド設定を持たないアプリ（Django + Vite の Islands 構成など）でもそのまま使えるようにするためです。

一方 components/ も配布物に含めます。tokens/theme.css の `@source "../components"` が、パッケージ内の .tsx が使うTailwindクラスを利用側のビルドに拾わせるために参照します。

### 取得

GitHub Packages配信のため、利用側には `read:packages` 権限のトークンが要ります。

    # 利用側リポジトリの .npmrc
    @hamirilo:registry=https://npm.pkg.github.com
    //npm.pkg.github.com/:_authToken=${NPM_TOKEN}

### 公開

GitHub Releaseをpublishすると `.github/workflows/publish.yml` が公開します。タグは `v<version>` とし、package.json の version と一致させてください（不一致はワークフローが検出して止めます）。

## 資産を追加するとき

1. 複数アプリで再利用できる汎用UIか確認する。
2. components/application/に実装し、components/ui/は下請けprimitiveに限定する。
3. Tokenはtokens/theme.cssを更新する。
4. Storybookに目的、状態、使い方、使わない場面を追加する。
5. typecheck、test、lint、Storybook buildを確認する。

実装の詳細な手順や昇格判断はPlaybookを参照してください。

