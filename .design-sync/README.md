# Claude Design 同期

このリポジトリのUI Kit（`application-ui-kit`）を [Claude Design](https://claude.ai/design) へ同期する仕組みについて。同期先のプロジェクトでは、Claude Designのdesign agentがこのリポジトリの実コンポーネント（実際にビルドされた`dist/`由来のbundle）を使ってUIを組み立てる。

## 何をしているか

`.design-sync/` 配下の設定に従い、Storybookの実描画と `dist/` のビルド成果物から次を生成してアップロードする。

- コンポーネントのbundle（`_ds_bundle.js` / `_ds_bundle.css`）と各コンポーネントのプレビューカード
- 各コンポーネントの `.d.ts` / `.prompt.md`（design agentが読むAPI仕様・使い方）
- Semantic Tokenやfontなどのスタイル一式

アップロード前に、生成した各プレビューがこのリポジトリの実Storybookと一致するか目視で検証する（品質保証の核）。

## 実行方法

Claude Code で `/design-sync` を実行する。初回は数十分〜数時間かかることがある（既存プロジェクトへの再同期は差分のみで済むことが多い）。

## 設定ファイル

| ファイル | git管理 | 内容 |
|---|---|---|
| `.design-sync/config.json` | される | `shape` / `buildCmd` / `titleMap` / `overrides` など、fork間で共通のビルド・検証設定 |
| `.design-sync/config.local.json` | **されない**（`.gitignore`） | `projectId` のみ。同期先のClaude Designプロジェクトを指す |
| `.design-sync/NOTES.md` | される | 過去の同期で判明した不具合・誤検知・re-sync時の注意点。**再同期の前に必ず読む** |
| `.design-sync/conventions.md` | される | design agentのsystem promptに載る、このUI Kit固有の使い方（wrapping、styling idiom等） |

### なぜ `projectId` だけ別ファイルなのか

このリポジトリは fork運用（[decisions/adr-0002](../decisions/adr-0002-fork-branch-and-upstream-flow.md)）を前提にしており、fork / ownerごとに同期先のClaude Designプロジェクトが異なりうる。`projectId` を `config.json` にコミットすると、全forkが同じ1つのプロジェクトへ同期してしまう。そのため `projectId` は `config.local.json`（`.env.local` と同じ発想の、コミットしないローカル設定）に分離している。

- 同期実行時、`config.local.json` があればそこから `projectId` を読み、`config.json` の内容とマージして使う。
- まだ存在しない場合（初回 clone、または初回同期）は、Claude Designの `list_projects` / `create_project` で対象プロジェクトを決め、そのIDを `config.local.json` に書く。
- `config.json` 自体に `projectId` を書き込んだまま commit しないこと。

## トラブルシューティング

同期中に警告や見た目の不一致が出たら、まず `.design-sync/NOTES.md` の「Known false positives」「Re-sync risks」を確認する。同じ調査を毎回やり直さないための記録なので、再同期のたびに更新すること。
