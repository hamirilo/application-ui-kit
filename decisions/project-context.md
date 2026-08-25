# Project Context

AI エージェントが実装前に読む、このリポジトリの現在の前提。
（[Project Setup](https://github.com/hamirilo/ai-dev-standards/blob/main/standards/governance/optional/project-setup.md) の「決めるもの」に対応）

## このリポジトリは何か

複数アプリで再利用する **UI ライブラリ**（npm パッケージ + Storybook + design-system/）。
Web アプリケーションではないため、アプリ向け前提の多くは「該当なし」。

| 項目 | 決定 |
|---|---|
| A. ログインの要否 | 該当なし（ライブラリのため認証を持たない。認証・認可は利用側アプリの責務） |
| B. ユーザー識別子 | 該当なし |
| C. 主対象デバイス | PC を優先する。ただしコンポーネントは狭い画面幅でも主要操作を失わないこと（README「品質確認」） |
| D. 起点レイアウト | 該当なし（Layout Profile は利用側アプリが選ぶ。このリポジトリは部品とパターンを提供する） |
| E. 業務権限の単位 | 該当なし |

## ライブラリ固有の前提

- **利用側の想定構成**: Django テンプレート + React Islands + htmx（ai-dev-standards ADR-0002）。
  純 React アプリからも `.` エントリだけで利用できる。
- **配布**: GitHub Packages の npm パッケージ（`@hamirilo/application-ui-kit`）。
  dist（ビルド済み JS + 型定義）を import させる。詳細は README「Package」。
- **技術**: React 19 + shadcn/ui（Base UI / gen3）+ Tailwind CSS v4。
  ツールチェーンは bun / vite / vitest / biome。
- **Token**: `tokens/theme.css` が SSOT。コンポーネントは semantic token のみを使う。
- **置かないもの**: 業務ドメイン固有 UI、アプリ固有設定、認証・エンドポイントを焼き込んだ連携。
  Django/htmx との**汎用的な**接続だけを `islands/` に置く（[ADR-0001](adr-0001-django-htmx-islands.md)）。
