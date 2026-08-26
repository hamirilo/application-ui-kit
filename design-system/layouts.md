# Layouts

新しい画面は、次のいずれかを起点にします。これは実装テンプレートではなく、ナビゲーションと主要操作の位置を揃えるためのProfileです。

## Standard

一般的な業務システム、管理画面、マスタ管理向け。

- 上部にGlobal Header、左に主要ナビゲーションのSidebarを置く。
- Page Headerにページ名と概要を置き、Primary Actionは通常その右側に置く。
- 一覧、詳細、設定など複数の画面を行き来するアプリの既定とする。

## Simple

単機能ツール、小規模ユーティリティ、簡易申請向け。

- Sidebarを置かず、HeaderとMain Contentで構成する。
- Page Headerは必要な場合だけ置く。
- 画面数が少なく、ナビゲーションより作業完了を優先する場合に使う。

## Focus

座席表、エディタ、キャンバス型ツール向け。

- Headerは最小限にし、主要操作は一貫したToolbarへ集約する。
- Main Workspaceを広く取り、補助情報は必要に応じてPanelやInspectorへ置く。
- 操作密度が高く、作業領域が主役の画面に使う。

## 共通ルール

- User Menuなど利用者に関する操作は、アプリ内で位置を無秩序に変えない。
- 画面で最も重要な操作はPrimary Actionを1つに絞る。補助操作を同じ強さにしない。
- Content幅、Grid、Filter Bar、Tabs、Toolbar、補助Panelは用途に応じて変えてよい。
