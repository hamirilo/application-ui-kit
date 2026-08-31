# ADR-0001: Django 連携 Islands をこのパッケージの公開 API に含める

**ステータス**: 採用

## コンテキスト

ai-dev-standards の [ADR-0002](https://github.com/hamirilo/ai-dev-standards/blob/main/decisions/adr-0002-frontend-technology-boundary.md) は React Islands をインタラクティブ UI の標準手段とし、htmx を次の 3 用途に限定している。

1. サーバー起点のリスト更新
2. React Island 内部からの HTML 取得（Django Form HTML をダイアログに表示）
3. `HX-Trigger` によるサーバー → クライアント通知（Toast 表示トリガー等）

この 2 と 3、および「`data-react` 属性から React コンポーネントを自動マウントする」仕組みは、Django + React Islands 構成のすべてのアプリが同じものを必要とする。前身の共有ライブラリ（jazmf-ui / dx-ui）は `./islands` としてこれを配布していたが、本リポジトリへの移行時に取り込まれておらず、このままでは各アプリが Island 層を再実装することになる（ONBOARDING 必守事項 2「採用済みの Shared UI 実装がある場合は再実装しない」と矛盾する）。

一方、本リポジトリは従来「サーバー連携を置かない」としてきた。また Application UI Standard §6 は「データ取得・認証・CSRF・エンドポイント設定を内包する UI パッケージ共有」を禁じている（Domain Component について）。

## 決定

1. Django 連携 Island（confirm-dialog / form-dialog / toast-listener / date-picker）、自動マウント、レジストリ、CSRF ヘルパーを `components/islands/` に置き、`./islands`（副作用なし）と `./islands/auto-mount`（副作用あり）の 2 エントリで配布する。
2. メインエントリ `.` は変更しない。純 React アプリは islands を import しなければ、これまで通りフレームワーク非依存のまま利用できる。
3. **焼き込まない境界を維持する。** エンドポイント URL・認証方式はテンプレート側の `data-*` 属性から渡す。CSRF は Django 既定の cookie 名 `csrftoken` を既定値とし、cookie 名だけを設定可能にする（Application UI Standard §6 が禁じるのは業務ドメイン UI への内包であり、ここでは接続方法をアプリ固有情報なしでパラメータ化する）。
4. 業務ドメイン固有の Island はこのパッケージへ追加しない。アプリ側で実装し `registerIslandComponents()` で登録する。

## 理由

- ADR-0002 の許可パターン 2・3 は実装がワンパターンで、アプリごとに差が出ることに価値がない。繰り返しが既に複数アプリで確認されている（先行抽象化ではない）。
- ai-dev-standards の [ADR-0004](https://github.com/hamirilo/ai-dev-standards/blob/main/decisions/adr-0004-shared-asset-boundaries.md) は「UI 実装は application-ui-kit がパッケージとして配布する」と定めており、Island 層は UI 実装の一部である。
- 副作用（自動マウント）をエントリ単位で分離すれば、ライブラリとしての tree-shaking と純 React 利用を損なわない。

## 結果

- Django + htmx のアプリは `import 'application-ui-kit/islands/auto-mount'` の 1 行で標準 Island を利用できる。実パッケージの owner 差分は利用側 `package.json` の npm alias が吸収する。
- `HX-Trigger` の既定イベント名は `application-form-success`。旧 dx-ui（`dx-form-success`）からの移行時は Django View 側のイベント名を変更するか、`data-success-event` で上書きする。
- 旧 dx-ui の `window.DxToast` / `window.showToast` は提供しない。`window.ApplicationToast` に一本化する（README「旧名称の互換 export は提供しない」方針に従う）。

## 見直し

htmx 以外の接続（WebSocket 等）や、Island の数が増えて配布単位を分けたくなった場合は、ai-dev-standards ADR-0004 の 7 に従い、このリポジトリ内でのパッケージ分割として扱う。
