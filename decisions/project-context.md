# Project Context

AI agentが実装前に読む、このrepositoryの現在の前提です。

## このrepositoryは何か

複数Applicationで再利用する **UI Platform** です。

- npm packageとして再利用可能なUIを配布する。
- StorybookでComponents / Patterns / Templatesを表示・比較・検証する。
- `design-system/` をAI / 人間向けの設計参照として提供する。
- Web Applicationそのものではないため、認証・業務認可等のApplication向け前提は原則として持たない。

| 項目 | 決定 |
|---|---|
| Login | 該当なし。認証・認可は利用側Applicationの責務 |
| User identifier | 該当なし |
| Primary device | PCを優先。ただしComponentは狭い画面幅でも主要操作を失わない |
| Layout Profile | 利用側Applicationが選ぶ。UI PlatformはComponent / Pattern / Templateを提供 |
| Business authorization | 該当なし |

## UI Platform固有の前提

- **利用側の想定構成**: Django Templates + React Islands + htmx。純React Applicationからもpackageのroot entryを利用できる。
- **Package**: Applicationからの依存名は `application-ui-kit`。GitHub Packages上の実package名は `@<owner>/application-ui-kit` とし、npm aliasでowner差分を利用側へ閉じ込める。
- **技術**: React 19 + shadcn/ui（Base UI）+ Tailwind CSS v4。toolchainはbun / Vite / Vitest / Biome。
- **Token**: `tokens/theme.css` が具体値のSource of Truth。ComponentはSemantic Tokenを利用する。
- **UI ownership**: Foundations / Components / Patterns / Templates / Catalog / design-systemをこのrepositoryが所有する。
- **置かないもの**: 業務domain固有UI、Application固有設定、認証やendpointを焼き込んだdomain連携。
- Django / htmxとの汎用的な接続だけをIslandsとして提供する。判断背景は [ADR-0001](adr-0001-django-htmx-islands.md) を参照する。

共有開発資産全体の境界は [ai-dev-platform](https://github.com/hamirilo/ai-dev-platform) のONBOARDINGと、[ai-dev-standards](https://github.com/hamirilo/ai-dev-standards) の共有資産境界ADRを正とします。
