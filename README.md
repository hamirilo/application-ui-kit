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

Storybookは包括的なデザインシステムではなく、**UI Kitのショールーム兼 開発・テスト環境**として位置付けます。Storyを増やすことが目的ではありません。UIを探す・比較する・理解する・検証するコストを下げることが目的です。

### 構成

    Getting Started      使い方とStory作成の基準
    Foundations          Colors / Typography / Spacing / Radius & Shadow / Icons
    Components           部品1つずつ（Overview + 個別Story）
    Patterns             Form / EmptyState / ErrorState / Search / DataTable など
    Gallery              All Components（全体の俯瞰）

### 3段階で見る

    Gallery              何があるか
       ↓
    Component Overview   どんな種類・状態があるか
       ↓
    Individual Story     実際にどう動くか

- **Gallery** は主要な部品を1画面に並べます。代表的な状態だけを載せ、Propsは網羅しません。
- **Overview** は各コンポーネントの先頭のStoryです。variant / size / 状態を1画面で比較します。デザイン確認・UIレビュー用のため、Controlsは無効にします。
- **個別Story** は1状態を1Storyで持ちます。操作・Props変更・Visual Regression Test・不具合再現に使います。
- **Patterns** は複数の部品を組み合わせた画面の作り方を示します。「どの部品を使うか」ではなく「アプリではどう組み合わせるか」です。
- **Foundations** は実装時に確認が必要な情報だけに限定します。

サイドバーのセクション順は `.storybook/preview.tsx` の `storySort` が決めます。コンポーネント内の並びはStoryファイル内の定義順のままなので、**Overviewはファイルの先頭に書きます**。

### Story作成の基準

すべての状態を機械的にStory化しません。次のいずれかに当てはまるものをStoryにします。

- 複数のバリエーションがある
- 状態によって見た目が大きく変わる
- Loading / Error / Empty を持つ
- UIレビューで確認する価値がある
- 実アプリでは再現しにくい（通信エラー、長い文字列、境界値など）
- Visual Regression Testの対象にしたい
- 使い方を間違えやすい

単純なshadcn/uiコンポーネントを、そのまま網羅的にStory化することは目的としません。詳細はStorybookの **Getting Started** を参照してください。見本を並べる表示部品は `stories/_showcase.tsx`（`Showcase` / `Section` / `Cluster` / `Stack` / `Labeled` / `Grid` / `Frame`）にあります。

## Token

tokens/theme.css がスタイルTokenの入口です。コンポーネントではraw colorではなく、bg-primary、text-foreground、border-borderなどのsemantic tokenを使います。アプリごとのブランド差分はアプリ側のToken overrideで表現し、コンポーネント実装を複製しないでください。

## shadcn/ui との関係

components/ui/ は shadcn/ui（Base UIベース）をそのまま取り込んだものです。見た目は `.tsx` に直書きせず、`cn-button-variant-default` のような **cn-\* クラス**を介して tokens/components.css が持ちます。

    components/ui/*.tsx      構造。shadcn/ui のソースをそのまま置く
    tokens/components.css    見た目。cn-* クラスの定義（このリポジトリが所有）
    tokens/theme.css         Token と、テンプレート用クラス（.btn-primary 等）

上流の style（style-nova.css 等）は取り込みません。このリポジトリは独自の見た目を持つため、cn-* の定義を自前で持ち、上流とはクラス名の契約だけを共有します。

### components/ui/ に入れた独自差分

上流を取り込み直すときは、次の差分を再適用してください。各ファイルの該当箇所に `<important>` コメントがあります。

| ファイル | 差分 | 理由 |
| --- | --- | --- |
| ui/button.tsx | `success` バリアント | --color-success と .btn-success に対応するものが上流にない |
| ui/toggle.tsx | `primary` バリアント | ApplicationButtonGroup の「選択中をprimary色で塗る」表現に必要 |
| ui/combobox.tsx | ComboboxChip の `removeLabel` | 上流の削除ボタンにアクセシブルな名前が付かない |
| ui/toast.tsx | 閉じるボタンのラベルを日本語化 | 上流は "Close toast" 固定 |

### 公開APIの2種類

- `Application*` — このリポジトリがAPIを設計したもの。items配列やcolumns/rowsのようなprops API、非同期ダイアログ、日本語の既定ラベルなど、shadcn/uiにないvalueを持つものだけを置きます。
- shadcn/ui の名前のまま re-export しているもの（`Card` / `Spinner` / `Textarea` / `Field` / `Empty` / `Item` 等）。ラップする理由がないため素のまま公開しています。APIは[shadcn/uiのドキュメント](https://ui.shadcn.com/docs/components)と同じです。

ラップは「足せるvalueがあるとき」だけ行ってください。名前を付け替えるだけのラッパーは作らないでください。

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
2. shadcn/uiに相当物がないか確認する（`npx shadcn@latest add <name>` で components/ui/ に入れられる）。
   相当物があり、足せるvalueがないなら、ラップせず index.ts から re-export するだけにする。
3. ラップする場合は components/application/ に実装し、何を足したのかをファイル冒頭に書く。
4. 見た目は tokens/components.css の cn-* に置き、.tsx にクラスを直書きしない。
   テンプレート用クラス（tokens/theme.css の @layer components）も併せて揃える。
5. Storybookに目的、状態、使い方、使わない場面を追加する。Overviewを先頭に置き、必要な状態を個別Storyにする。Galleryに代表的な見た目を1つ足す。
6. typecheck、test、lint、Storybook buildを確認する。

実装の詳細な手順や昇格判断はPlaybookを参照してください。

